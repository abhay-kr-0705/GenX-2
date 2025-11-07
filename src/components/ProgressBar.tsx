import React from 'react';
import { Progress } from 'antd';

interface ProgressBarProps {
  current: number;
  total: number;
  status?: 'success' | 'exception' | 'active' | 'normal';
  showInfo?: boolean;
  strokeColor?: string;
  trailColor?: string;
  size?: 'default' | 'small';
  format?: (percent?: number, successPercent?: number) => React.ReactNode;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  status = 'active',
  showInfo = true,
  strokeColor,
  trailColor,
  size = 'default',
  format
}) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  const defaultFormat = (percent?: number) => {
    return `${current}/${total} (${percent}%)`;
  };

  return (
    <div className="w-full">
      <Progress
        percent={percentage}
        status={status}
        showInfo={showInfo}
        strokeColor={strokeColor}
        trailColor={trailColor}
        size={size}
        format={format || defaultFormat}
      />
    </div>
  );
};

export default ProgressBar;
