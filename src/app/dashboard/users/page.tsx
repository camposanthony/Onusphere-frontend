import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Plus, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock data for team members
const teamMembers = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@company.com',
    title: 'Admin',
    avatarUrl: '/placeholder-avatar.jpg',
    initials: 'JS',
    lastActive: '5 minutes ago',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    title: 'Manager',
    avatarUrl: '/placeholder-avatar.jpg',
    initials: 'SJ',
    lastActive: '1 hour ago',
  },
  {
    id: 3,
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    title: 'Team Member',
    avatarUrl: '/placeholder-avatar.jpg',
    initials: 'MC',
    lastActive: '3 hours ago',
  },
  {
    id: 4,
    name: 'Jessica Taylor',
    email: 'jessica.taylor@company.com',
    title: 'Team Member',
    avatarUrl: '/placeholder-avatar.jpg',
    initials: 'JT',
    lastActive: 'Yesterday',
  },
  {
    id: 5,
    name: 'David Rodriguez',
    email: 'david.rodriguez@company.com',
    title: 'Manager',
    avatarUrl: '/placeholder-avatar.jpg',
    initials: 'DR',
    lastActive: '2 days ago',
  },
];

// Badge color based on role
const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'Admin':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'Manager':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground">
            Manage team members who have access to your dashboard.
          </p>
        </div>
        <Button className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          <span>Add Team Member</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                People from your organization who can access the application.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <span className="text-lg font-semibold">{teamMembers.length}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-11 gap-4 p-4 bg-muted/50 font-medium text-sm">
              <div className="col-span-4">Name</div>
              <div className="col-span-3">Email</div>
              <div className="col-span-2">Title</div>
              <div className="col-span-1">Last Active</div>
              <div className="col-span-1"></div>
            </div>
            <div className="divide-y">
              {teamMembers.map((member) => (
                <div key={member.id} className="grid grid-cols-11 gap-4 p-4 items-center">
                  <div className="col-span-4 flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatarUrl} alt={member.name} />
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{member.name}</span>
                  </div>
                  <div className="col-span-3 text-sm text-muted-foreground">{member.email}</div>
                  <div className="col-span-2 text-sm">{member.title}</div>
                  <div className="col-span-1 text-sm text-muted-foreground">{member.lastActive}</div>
                  <div className="col-span-1 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edit details</DropdownMenuItem>
                        <DropdownMenuItem>Change role</DropdownMenuItem>
                        <DropdownMenuItem>Reset password</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Remove user
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
          <CardDescription>
            Invitations that have been sent but not yet accepted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-dashed bg-muted/50 p-8 text-center">
            <p className="text-muted-foreground mb-4">No pending invitations</p>
            <Button variant="outline" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Send New Invitation</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
