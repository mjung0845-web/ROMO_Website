<?php
/**
 * ROMO Marketing – Kontaktformular Backend
 * DSGVO-konform: Daten werden nur per E-Mail weitergeleitet, nicht gespeichert.
 *
 * WICHTIG: Trage unten deine E-Mail-Adresse ein, bevor du hochlädst.
 */

header('Content-Type: application/json; charset=utf-8');

// ---- Konfiguration ----
$empfaenger = 'team@romo-marketingmedia.de';  // <-- DEINE E-MAIL HIER
$absender_domain = 'romo-marketing.de';  // <-- DEINE DOMAIN HIER

// ---- Nur POST erlauben ----
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Methode nicht erlaubt']);
    exit;
}

// ---- Honeypot-Spam-Schutz ----
if (!empty($_POST['website'])) {
    echo json_encode(['success' => true]); // Stille Annahme für Bots
    exit;
}

// ---- CSRF-Schutz via Referer ----
$referer = $_SERVER['HTTP_REFERER'] ?? '';
if (!empty($referer) && strpos($referer, $absender_domain) === false) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Ungültige Anfrage']);
    exit;
}

// ---- Eingaben bereinigen ----
function clean(string $input): string {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

$name    = clean($_POST['name']    ?? '');
$email   = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$subject = clean($_POST['subject'] ?? 'Kontaktanfrage');
$message = clean($_POST['message'] ?? '');
$dsgvo   = isset($_POST['dsgvo']) ? true : false;

// ---- Validierung ----
$errors = [];
if (strlen($name) < 2)                        $errors[] = 'Name zu kurz.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Ungültige E-Mail-Adresse.';
if (strlen($message) < 10)                     $errors[] = 'Nachricht zu kurz.';
if (!$dsgvo)                                   $errors[] = 'Datenschutz muss akzeptiert werden.';

if (!empty($errors)) {
    echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
    exit;
}

// ---- Rate-Limiting (einfach via Session) ----
session_start();
$now = time();
if (isset($_SESSION['last_contact']) && ($now - $_SESSION['last_contact']) < 60) {
    echo json_encode(['success' => false, 'message' => 'Bitte warte einen Moment vor dem erneuten Senden.']);
    exit;
}
$_SESSION['last_contact'] = $now;

// ---- E-Mail zusammenstellen ----
$mail_subject = '=?UTF-8?B?' . base64_encode('[ROMO Marketing] ' . $subject) . '?=';

$mail_body = "Neue Kontaktanfrage über romo-marketing.de\n";
$mail_body .= str_repeat('-', 50) . "\n\n";
$mail_body .= "Name:       {$name}\n";
$mail_body .= "E-Mail:     {$email}\n";
$mail_body .= "Betreff:    {$subject}\n";
$mail_body .= "Datum:      " . date('d.m.Y H:i') . " Uhr\n\n";
$mail_body .= "Nachricht:\n{$message}\n\n";
$mail_body .= str_repeat('-', 50) . "\n";
$mail_body .= "DSGVO-Einwilligung: Ja (Zeitstempel: " . date('Y-m-d H:i:s') . ")\n";

$headers  = "From: noreply@{$absender_domain}\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "X-Mailer: ROMO-Marketing-Web\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";

// ---- Senden ----
$sent = mail($empfaenger, $mail_subject, $mail_body, $headers);

if ($sent) {
    // Bestätigungs-E-Mail an Absender
    $confirm_subject = '=?UTF-8?B?' . base64_encode('Deine Anfrage bei ROMO Marketing') . '?=';
    $confirm_body  = "Hallo {$name},\n\n";
    $confirm_body .= "vielen Dank für deine Anfrage! Wir haben deine Nachricht erhalten und\n";
    $confirm_body .= "melden uns schnellstmöglich bei dir.\n\n";
    $confirm_body .= "Dein ROMO Marketing Team\n\n";
    $confirm_body .= "--\nROMO Marketing\nE-Mail: {$empfaenger}\n";
    $confirm_headers  = "From: info@{$absender_domain}\r\n";
    $confirm_headers .= "MIME-Version: 1.0\r\n";
    $confirm_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    mail($email, $confirm_subject, $confirm_body, $confirm_headers);

    echo json_encode(['success' => true]);
} else {
    error_log("ROMO Marketing: mail() failed for " . $email);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'E-Mail konnte nicht gesendet werden. Bitte versuche es später erneut.']);
}
?>
