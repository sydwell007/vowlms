<?php
require_once __DIR__ . '/../config/env.php';

function sendMail(string $to, string $subject, string $htmlBody): bool {
    $from    = env('SMTP_FROM', 'noreply@goalvow.com');
    $fromName = 'GoalVow LMS';

    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $headers .= "From: {$fromName} <{$from}>\r\n";
    $headers .= "Reply-To: {$from}\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    return mail($to, $subject, $htmlBody, $headers);
}

function resetPasswordEmail(string $name, string $token): string {
    $url = env('VOWLMS_APP_URL', 'https://vowlms.vercel.app');
    $link = "{$url}/auth/reset-password?token={$token}";

    return "
    <html><body style='font-family:sans-serif;color:#1a1a1a;background:#f8f9fa;padding:40px 0;'>
    <div style='max-width:540px;margin:0 auto;background:#fff;border-radius:16px;padding:40px;'>
      <div style='text-align:center;margin-bottom:32px;'>
        <div style='display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;background:#f5c542;border-radius:10px;font-size:18px;font-weight:900;color:#06111f;'>VL</div>
        <h2 style='margin:16px 0 4px;color:#06111f;'>Reset your password</h2>
        <p style='color:#6b7280;margin:0;font-size:14px;'>VowLMS · GoalVow Holdings</p>
      </div>
      <p style='color:#374151;'>Hi {$name},</p>
      <p style='color:#374151;'>We received a request to reset your password. Click the button below to set a new password. This link expires in 1 hour.</p>
      <div style='text-align:center;margin:32px 0;'>
        <a href='{$link}' style='display:inline-block;background:#f5c542;color:#06111f;font-weight:700;font-size:14px;padding:14px 28px;border-radius:10px;text-decoration:none;'>Reset password</a>
      </div>
      <p style='color:#6b7280;font-size:13px;'>If you didn't request a password reset, ignore this email — your account is safe.</p>
      <p style='color:#6b7280;font-size:12px;margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb;'>GoalVow Holdings (Pty) Ltd · 17 Vultee, Cape Town · support@goalvow.com</p>
    </div>
    </body></html>";
}

function welcomeEmail(string $name): string {
    $url = env('VOWLMS_APP_URL', 'https://vowlms.vercel.app');
    return "
    <html><body style='font-family:sans-serif;color:#1a1a1a;background:#f8f9fa;padding:40px 0;'>
    <div style='max-width:540px;margin:0 auto;background:#fff;border-radius:16px;padding:40px;'>
      <div style='text-align:center;margin-bottom:32px;'>
        <div style='display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;background:#f5c542;border-radius:10px;font-size:18px;font-weight:900;color:#06111f;'>VL</div>
        <h2 style='margin:16px 0 4px;color:#06111f;'>Welcome to VowLMS!</h2>
      </div>
      <p style='color:#374151;'>Hi {$name},</p>
      <p style='color:#374151;'>Your VowLMS account is ready. Sign in to explore the current GoalVow academy catalogue and manage learning activity recorded to your account.</p>
      <div style='text-align:center;margin:32px 0;'>
        <a href='{$url}/courses' style='display:inline-block;background:#f5c542;color:#06111f;font-weight:700;font-size:14px;padding:14px 28px;border-radius:10px;text-decoration:none;'>Explore courses</a>
      </div>
      <p style='color:#6b7280;font-size:12px;margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb;'>GoalVow Holdings (Pty) Ltd · support@goalvow.com</p>
    </div>
    </body></html>";
}
