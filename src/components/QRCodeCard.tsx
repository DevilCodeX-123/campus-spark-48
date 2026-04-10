import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeCardProps {
  value: string;
  eventTitle: string;
  date: string;
  venue: string;
}

const QRCodeCard: React.FC<QRCodeCardProps> = ({ value, eventTitle, date, venue }) => {
  return (
    <div className="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
      <div className="mx-auto mb-4 inline-block rounded-lg bg-background p-4">
        <QRCodeSVG value={value} size={160} />
      </div>
      <h3 className="font-heading text-lg font-semibold text-foreground">{eventTitle}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{date} • {venue}</p>
      <p className="mt-2 rounded-md bg-muted px-3 py-1 text-xs font-mono text-muted-foreground">{value}</p>
    </div>
  );
};

export default QRCodeCard;
