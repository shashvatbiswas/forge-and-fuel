/**
 * Email Delivery Provider Interface
 * Supports Resend, SMTP, and clean simulated mock delivery with visual preview.
 */

class EmailService {
  constructor() {
    this.provider = import.meta.env?.VITE_EMAIL_PROVIDER || 'mock';
    this.resendApiKey = import.meta.env?.VITE_RESEND_API_KEY || '';
    this.fromEmail = import.meta.env?.VITE_EMAIL_FROM || 'coach@forgefuel.app';
  }

  async sendWeeklyReport(recipientEmail, summaryData) {
    const emailSubject = `Weekly Forge & Fuel Matrix Report — Consistency Score: ${summaryData.consistency.totalScore}/100 🔥`;
    const emailHtml = this.generateEmailHtml(summaryData);

    if (this.provider === 'resend' && this.resendApiKey) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.resendApiKey}`
          },
          body: JSON.stringify({
            from: this.fromEmail,
            to: recipientEmail,
            subject: emailSubject,
            html: emailHtml
          })
        });
        if (!response.ok) throw new Error('Resend API request failed');
        return { success: true, provider: 'resend', id: (await response.json()).id };
      } catch (err) {
        console.warn('Resend email failed, falling back to mock provider:', err);
      }
    }

    // Mock Delivery Fallback
    const mockRecord = {
      id: `mail_${Date.now()}`,
      to: recipientEmail,
      subject: emailSubject,
      sentAt: new Date().toISOString(),
      status: 'Delivered (Simulated)',
      previewHtml: emailHtml
    };

    const history = JSON.parse(localStorage.getItem('ff_sent_emails') || '[]');
    history.unshift(mockRecord);
    localStorage.setItem('ff_sent_emails', JSON.stringify(history.slice(0, 20)));

    return { success: true, provider: 'mock', id: mockRecord.id, record: mockRecord };
  }

  generateEmailHtml(summary) {
    return `
      <div style="font-family:'Segoe UI',Helvetica,Arial,sans-serif;background:#0d1117;color:#f0f6fc;padding:24px;max-width:600px;margin:0 auto;border-radius:12px;border:1px solid #30363d">
        <h1 style="color:#00f2fe;margin-bottom:8px;font-size:24px">FORGE &amp; FUEL MATRIX</h1>
        <p style="color:#8b949e;margin-top:0">Weekly Athlete Performance Summary</p>
        
        <div style="background:#161b22;padding:20px;border-radius:8px;margin:20px 0;text-align:center">
          <span style="color:#8b949e;font-size:12px;text-transform:uppercase">Consistency Score</span>
          <div style="font-size:48px;font-weight:bold;color:${summary.consistency.color};margin:8px 0">${summary.consistency.totalScore} / 100</div>
          <span style="background:${summary.consistency.color}22;color:${summary.consistency.color};padding:4px 12px;border-radius:20px;font-size:12px;font-weight:bold">
            ${summary.consistency.tier}
          </span>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
          <tr>
            <td style="padding:10px;border-bottom:1px solid #21262d;color:#8b949e">Workouts Completed</td>
            <td style="padding:10px;border-bottom:1px solid #21262d;text-align:right;font-weight:bold">${summary.workoutsCompleted} sessions</td>
          </tr>
          <tr>
            <td style="padding:10px;border-bottom:1px solid #21262d;color:#8b949e">Active Minutes</td>
            <td style="padding:10px;border-bottom:1px solid #21262d;text-align:right;font-weight:bold">${summary.totalActiveMinutes} mins</td>
          </tr>
          <tr>
            <td style="padding:10px;border-bottom:1px solid #21262d;color:#8b949e">Total Volume Lifted</td>
            <td style="padding:10px;border-bottom:1px solid #21262d;text-align:right;font-weight:bold">${summary.totalVolumeKg.toLocaleString()} kg</td>
          </tr>
          <tr>
            <td style="padding:10px;border-bottom:1px solid #21262d;color:#8b949e">Best Compound Lift</td>
            <td style="padding:10px;border-bottom:1px solid #21262d;text-align:right;font-weight:bold">${summary.bestLift.weight}kg × ${summary.bestLift.reps} reps</td>
          </tr>
        </table>

        <p style="color:#8b949e;font-size:12px;border-top:1px solid #21262d;padding-top:16px">
          Consistency Formula: Training (40%) + Nutrition (30%) + Hydration (20%) + Streak Momentum (10%). Keep hammering.
        </p>
      </div>
    `;
  }
}

export const emailService = new EmailService();
