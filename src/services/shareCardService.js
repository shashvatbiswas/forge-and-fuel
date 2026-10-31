/**
 * Share Card Canvas Generator Service
 * Renders high-resolution (800x1000 4:5 aspect ratio) workout achievement cards
 * for Instagram Stories, WhatsApp, and social channels with Web Share API and download support.
 */

class ShareCardService {
  drawWorkoutCard(canvas, {
    athleteName = 'Athlete',
    workoutTitle = 'Hypertrophy Circuit',
    totalVolumeKg = 8420,
    durationMins = 52,
    setsCount = 16,
    consistencyScore = 88,
    prText = '',
    themeColor = '#00f2fe'
  }) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // 1. Background fill
    ctx.fillStyle = '#080c11';
    ctx.fillRect(0, 0, w, h);

    // 2. Ambient gradient glow
    const glow = ctx.createRadialGradient(w / 2, 220, 50, w / 2, 220, 480);
    glow.addColorStop(0, `${themeColor}33`);
    glow.addColorStop(0.6, `${themeColor}0a`);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // 3. Grid line accents
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 40; x < w; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 40; y < h; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // 4. Card Inner Frame
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 2;
    ctx.strokeRect(36, 36, w - 72, h - 72);

    // 5. Header: Brand & Athlete
    ctx.fillStyle = themeColor;
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('FORGE & FUEL MATRIX', 64, 84);

    ctx.fillStyle = '#ffffff';
    ctx.font = '16px sans-serif';
    ctx.fillText(`ATHLETE: ${athleteName.toUpperCase()} · ${new Date().toLocaleDateString()}`, 64, 114);

    // 6. Workout Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText(workoutTitle.toUpperCase(), 64, 200);

    // 7. Divider
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(64, 224);
    ctx.lineTo(w - 64, 224);
    ctx.stroke();

    // 8. 4-Box Metrics Grid (2x2)
    const metrics = [
      { label: 'VOLUME LIFTED', val: `${totalVolumeKg.toLocaleString()} kg`, icon: 'VOLUME' },
      { label: 'ACTIVE TIME', val: `${durationMins} mins`, icon: 'TIME' },
      { label: 'SETS COMPLETED', val: `${setsCount} sets`, icon: 'SETS' },
      { label: 'CONSISTENCY SCORE', val: `${consistencyScore} / 100`, icon: 'SCORE' }
    ];

    const boxW = 320;
    const boxH = 120;
    const coords = [
      { x: 64, y: 260 },
      { x: 416, y: 260 },
      { x: 64, y: 410 },
      { x: 416, y: 410 }
    ];

    metrics.forEach((m, idx) => {
      const { x, y } = coords[idx];
      // Box background
      ctx.fillStyle = '#121822';
      ctx.fillRect(x, y, boxW, boxH);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, boxW, boxH);

      // Label
      ctx.fillStyle = '#8b949e';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(m.label, x + 20, y + 36);

      // Value
      ctx.fillStyle = themeColor;
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText(m.val, x + 20, y + 84);
    });

    // 9. Personal Record Callout (if present)
    if (prText) {
      const prY = 570;
      ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
      ctx.fillRect(64, prY, w - 128, 70);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(64, prY, w - 128, 70);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`🔥 NEW PR: ${prText.toUpperCase()}`, 88, prY + 42);
    }

    // 10. Footer Tagline & Badge
    ctx.fillStyle = '#8b949e';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('DISCIPLINE OVER MOTIVATION.', 64, h - 80);

    ctx.fillStyle = themeColor;
    ctx.font = '14px sans-serif';
    ctx.fillText('forgefuel.app · Share your grind', 64, h - 56);
  }

  downloadCard(canvas, filename = 'forge-fuel-workout.png') {
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  async shareCard(canvas, { title = 'My Workout Session', text = 'Crushed another session on FORGE & FUEL!' } = {}) {
    if (!canvas) return false;

    if (navigator.share && navigator.canShare) {
      try {
        const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
        const file = new File([blob], 'workout-card.png', { type: 'image/png' });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title,
            text,
            files: [file]
          });
          return true;
        }
      } catch (err) {
        // Fallback to regular share or download
      }
    }

    // Fallback: direct download
    this.downloadCard(canvas);
    return true;
  }
}

export const shareCardService = new ShareCardService();
