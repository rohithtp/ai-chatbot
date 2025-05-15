import cx from 'classnames';

interface User {
  name: string;
}

const SAMPLE_USERS: User[] = [
  { name: 'John Doe' },
  { name: 'Jane Doe' },
];

export function UserList({ users = SAMPLE_USERS }: { users?: User[] }) {
  return (
    <div className={cx('flex flex-col gap-4 rounded-2xl p-4 skeleton-bg max-w-[500px] bg-blue-100')}>
      <div className="text-2xl font-semibold text-blue-900 mb-2">User List</div>
      <div className="flex flex-col gap-2">
        {users.map((user, idx) => (
          <div
            key={user.name}
            className={cx(
              'flex flex-row items-center gap-3 p-3 rounded-lg skeleton-div',
              idx % 2 === 0 ? 'bg-blue-50' : 'bg-blue-200',
            )}
          >
            <div className="size-8 rounded-full bg-blue-300 flex items-center justify-center text-blue-900 font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="text-lg text-blue-900">{user.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 