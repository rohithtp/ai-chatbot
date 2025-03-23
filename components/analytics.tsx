import { useState, useEffect } from 'react';
import cx from 'classnames';
import { ClockRewind, GlobeIcon, MessageIcon, WarningIcon } from './icons';

interface AnalyticsCardProps {
  title: string;
  data: Record<string, string | number>;
  icon: React.ReactNode;
  isLoading?: boolean;
}

function AnalyticsCard({ title, data, icon, isLoading = false }: AnalyticsCardProps) {
  return (
    <div className={cx(
      'flex flex-col gap-4 rounded-2xl p-4 max-w-[500px]',
      'bg-zinc-100 dark:bg-zinc-800',
      { 'animate-pulse': isLoading }
    )}>
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 items-center">
          <div className="text-zinc-500">{icon}</div>
          <div className="text-lg font-medium">{title}</div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="text-zinc-500">{key}</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChatStatistics({ data }: { data: any }) {
  return (
    <AnalyticsCard
      title="Chat Statistics"
      icon={<MessageIcon size={20} />}
      data={{
        'Total Chats': data.chat_count || 0,
        'Public Chats': data.public_chats || 0,
        'Private Chats': data.private_chats || 0,
      }}
    />
  );
}

export function UserActivity({ data }: { data: any }) {
  return (
    <AnalyticsCard
      title="User Activity"
      icon={<ClockRewind size={20} />}
      data={{
        'Active Users': data.active_users || 0,
        'Total Messages': data.total_messages || 0,
        'Last Activity': data.last_activity || 'N/A',
      }}
    />
  );
}

export function MessageHistory({ data }: { data: any }) {
  return (
    <AnalyticsCard
      title="Message History"
      icon={<MessageIcon size={20} />}
      data={{
        'User Messages': data.user_messages || 0,
        'Assistant Messages': data.assistant_messages || 0,
        'Average Response Time': data.avg_response_time || 'N/A',
      }}
    />
  );
}

export function VoteAnalytics({ data }: { data: any }) {
  return (
    <AnalyticsCard
      title="Vote Analytics"
      icon={<MessageIcon size={20} />}
      data={{
        'Total Votes': data.total_votes || 0,
        'Upvotes': data.upvotes || 0,
        'Downvotes': data.downvotes || 0,
      }}
    />
  );
}

export function ChatVisibility({ data }: { data: any }) {
  return (
    <AnalyticsCard
      title="Chat Visibility"
      icon={<GlobeIcon size={20} />}
      data={{
        'Public': data.public_count || 0,
        'Private': data.private_count || 0,
        'Total': data.total_count || 0,
      }}
    />
  );
} 