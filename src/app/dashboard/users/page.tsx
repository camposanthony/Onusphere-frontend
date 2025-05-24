"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Plus, Users, Loader2, Mail, RotateCcw, Trash2, X, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  getMembers, 
  getPendingInvitations, 
  sendInvitation, 
  resendInvitation, 
  deleteInvitation,
  createMailtoLink,
  Member, 
  Invitation,
  SendInvitationData 
} from "@/lib/services/users";
import { InvitationDialog } from "@/components/InvitationDialog";

// Badge color based on role
const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "admin":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-0";
    case "manager":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-0";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300 border-0";
  }
};

export default function UsersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const [membersData, invitationsData] = await Promise.all([
        getMembers(),
        getPendingInvitations(),
      ]);
      setMembers(membersData);
      setInvitations(invitationsData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch data",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendInvitation = async (invitationData: SendInvitationData) => {
    setInviteLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const newInvitation = await sendInvitation(invitationData);
      setInvitations(prev => [...prev, newInvitation]);
      
      // Open email client with the invitation
      if (newInvitation.email_template) {
        const mailtoLink = createMailtoLink(newInvitation.email_template);
        window.location.href = mailtoLink;
      }
      
      setSuccessMessage(`Invitation created! Your email client should open with the invitation email for ${invitationData.email}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create invitation");
      throw err; // Re-throw to prevent dialog from closing
    } finally {
      setInviteLoading(false);
    }
  };

  const handleResendInvitation = async (invitationId: string) => {
    setResendingId(invitationId);
    setError(null);
    setSuccessMessage(null);

    try {
      const updatedInvitation = await resendInvitation(invitationId);
      setInvitations(prev => 
        prev.map(inv => inv.id === invitationId ? updatedInvitation : inv)
      );
      
      // Open email client with the invitation
      if (updatedInvitation.email_template) {
        const mailtoLink = createMailtoLink(updatedInvitation.email_template);
        window.location.href = mailtoLink;
      }
      
      setSuccessMessage("Your email client should open with the updated invitation email.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend invitation");
    } finally {
      setResendingId(null);
    }
  };

  const handleDeleteInvitation = async (invitationId: string) => {
    setDeletingId(invitationId);
    setError(null);
    setSuccessMessage(null);

    try {
      await deleteInvitation(invitationId);
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      setSuccessMessage("Invitation cancelled successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel invitation");
    } finally {
      setDeletingId(null);
    }
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 8000); // Increased to 8 seconds for longer message
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Enhanced Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                    Team Members
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 text-lg">
                    Manage team members who have access to your dashboard
                  </p>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => setInviteDialogOpen(true)}
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 h-11 px-6 transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="p-4 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                <span>{successMessage}</span>
              </div>
              <button 
                onClick={() => setSuccessMessage(null)}
                className="text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {error && (
            <div className="p-4 text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl flex items-center justify-between">
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                className="text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Enhanced Team Members Card */}
          <Card className="shadow-none border border-slate-200 dark:border-slate-700 transition-all duration-200">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl text-slate-900 dark:text-white">Team Members</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400 mt-1">
                    People from your organization who can access the application
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                    {members.length}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-slate-600 dark:text-slate-400">Loading members...</span>
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden">
                  <div className="grid grid-cols-11 gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 font-medium text-sm text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                    <div className="col-span-4">Name</div>
                    <div className="col-span-3">Email</div>
                    <div className="col-span-2">Role</div>
                    <div className="col-span-1">Joined</div>
                    <div className="col-span-1"></div>
                  </div>
                  <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="grid grid-cols-11 gap-4 p-6 items-center hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors duration-200"
                      >
                        <div className="col-span-4 flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-slate-200 dark:border-slate-700">
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/30 text-primary font-semibold">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-slate-900 dark:text-white">{member.name}</span>
                        </div>
                        <div className="col-span-3 text-sm text-slate-600 dark:text-slate-400">
                          {member.email}
                        </div>
                        <div className="col-span-2">
                          <Badge className={getRoleBadgeColor(member.role)}>
                            {member.role.charAt(0).toUpperCase() +
                              member.role.slice(1)}
                          </Badge>
                        </div>
                        <div className="col-span-1 text-sm text-slate-600 dark:text-slate-400">
                          {new Date(member.date_created).toLocaleDateString()}
                        </div>
                        <div className="col-span-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuItem>Edit Role</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                Remove Member
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Pending Invitations Card */}
          <Card className="shadow-none border border-slate-200 dark:border-slate-700 transition-all duration-200">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700">
              <CardTitle className="text-xl text-slate-900 dark:text-white">Pending Invitations</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 mt-1">
                Invitations that have been created but not yet accepted
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {invitations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600">
                  <div className="mb-4 text-slate-600 dark:text-slate-400 flex flex-col items-center">
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
                      <Mail className="h-8 w-8 text-white" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      No pending invitations
                    </span>
                    <span className="text-slate-600 dark:text-slate-400 text-center max-w-sm leading-relaxed">
                      Create invitations to add team members to your organization
                    </span>
                  </div>
                  <Button 
                    onClick={() => setInviteDialogOpen(true)}
                    className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 h-11 px-6 transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Invitation
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {invitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {invitation.email}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <Badge className={getRoleBadgeColor(invitation.role)}>
                              {invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}
                            </Badge>
                            <span>•</span>
                            <span>Invited by {invitation.invited_by}</span>
                            <span>•</span>
                            <span>Expires {new Date(invitation.expires_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResendInvitation(invitation.id)}
                          disabled={resendingId === invitation.id}
                          className="h-8"
                        >
                          {resendingId === invitation.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <>
                              <RotateCcw className="h-3 w-3 mr-1" />
                              Resend
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteInvitation(invitation.id)}
                          disabled={deletingId === invitation.id}
                          className="h-8 text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          {deletingId === invitation.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <>
                              <Trash2 className="h-3 w-3 mr-1" />
                              Cancel
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invitation Dialog */}
      <InvitationDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        onInvite={handleSendInvitation}
        loading={inviteLoading}
      />
    </div>
  );
}
