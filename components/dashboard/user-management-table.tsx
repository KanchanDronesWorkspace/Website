import React from 'react'
import type { User } from '@/lib/types/blog-management'

interface UserManagementTableProps {
  users: User[]
  onRoleChange: (userId: string, role: 'admin' | 'employee') => void
}

export function UserManagementTable({ users, onRoleChange }: UserManagementTableProps) {
  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-foreground">{user.full_name || 'Unknown'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-foreground">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-accent/20 text-accent border border-accent/30' 
                      : 'bg-primary/20 text-primary border border-primary/30'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    user.is_active 
                      ? 'bg-accent/20 text-accent border border-accent/30' 
                      : 'bg-red-500/20 text-red-500 border border-red-500/30'
                  }`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <select
                    value={user.role}
                    onChange={(e) => onRoleChange(user.id, e.target.value as 'admin' | 'employee')}
                    className="text-sm border border-border rounded px-2 py-1 bg-background text-foreground"
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

