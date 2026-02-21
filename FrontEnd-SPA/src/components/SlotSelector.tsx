import React, { useState } from 'react';
import '../styles/SlotSelector.scss';

interface SlotSelectorProps {
  slots: string[];
  onSelectSlot: (slot: string) => void;
  isLoading?: boolean;
}

export const SlotSelector: React.FC<SlotSelectorProps> = ({
  slots,
  onSelectSlot,
  isLoading = false,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const handleSelectSlot = (slot: string) => {
    setSelectedSlot(slot);
    onSelectSlot(slot);
  };

  const formatTime = (slot: string) => {
    try {
      const date = new Date(slot);
      return {
        date: date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
        time: date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      };
    } catch {
      return { date: slot, time: '' };
    }
  };

  return (
    <div className="slot-selector">
      <h3 className="slots-title">Available Appointment Slots</h3>
      <div className="slots-grid">
        {slots.map((slot) => {
          const { date, time } = formatTime(slot);
          return (
            <button
              key={slot}
              className={`slot-button ${selectedSlot === slot ? 'selected' : ''}`}
              onClick={() => handleSelectSlot(slot)}
              disabled={isLoading}
              aria-pressed={selectedSlot === slot}
            >
              <div className="slot-date">{date}</div>
              <div className="slot-time">{time}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
