import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Link as LinkIcon, 
  Copy, 
  Check, 
  Heart, 
  UserPlus, 
  Clock,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

interface Partnership {
  id: string;
  user1_id: string;
  user2_id: string;
  status: 'pending' | 'accepted';
  created_at: string;
}

interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url?: string;
}

export function PartnershipManager() {
  const { user } = useAuth();
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [partnerProfiles, setPartnerProfiles] = useState<Profile[]>([]);
  const [inviteCode, setInviteCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [joiningPartnership, setJoiningPartnership] = useState(false);

  useEffect(() => {
    if (user) {
      loadPartnerships();
      generateInviteCode();
      
      // Check for invite code in URL once when component mounts
      const urlParams = new URLSearchParams(window.location.search);
      const urlInviteCode = urlParams.get('invite');
      if (urlInviteCode) {
        setJoinCode(urlInviteCode);
        // Clear the URL parameter
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [user]);

  const loadPartnerships = async () => {
    if (!user) return;

    try {
      // Get partnerships where user is involved
      const { data: partnershipsData, error: partnershipsError } = await supabase
        .from('partnerships')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (partnershipsError) throw partnershipsError;

      setPartnerships((partnershipsData || []) as Partnership[]);

      // Get partner profiles
      if (partnershipsData && partnershipsData.length > 0) {
        const partnerIds = partnershipsData.map(p => 
          p.user1_id === user.id ? p.user2_id : p.user1_id
        );

        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('user_id', partnerIds);

        if (profilesError) throw profilesError;

        setPartnerProfiles(profilesData || []);
      }
    } catch (error) {
      console.error('Error loading partnerships:', error);
      toast.error('Failed to load partnerships');
    } finally {
      setLoading(false);
    }
  };

  const generateInviteCode = () => {
    // Generate a simple invite code based on user ID
    if (user) {
      // Use a simpler approach - just use first 8 chars of user ID
      const code = user.id.replace(/-/g, '').substring(0, 8).toUpperCase();
      setInviteCode(code);
    }
  };

  const copyInviteLink = async () => {
    const inviteLink = `${window.location.origin}?invite=${inviteCode}`;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success('Invite link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy invite link');
    }
  };

  const joinWithCode = async () => {
    if (!user || !joinCode.trim()) return;

    setJoiningPartnership(true);
    try {
      // Find the user whose user_id starts with the invite code (first 8 chars without dashes)
      const searchPattern = joinCode.toLowerCase().replace(/-/g, '');
      console.log('Searching for invite code:', joinCode, 'Pattern:', searchPattern);
      
      // Get all profiles and find the one whose user_id (without dashes) starts with our code
      const { data: allProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, display_name')
        .not('user_id', 'eq', user.id); // Exclude current user

      console.log('Profiles found:', allProfiles, 'Error:', profilesError);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        toast.error('Failed to search for invite code');
        return;
      }

      if (!allProfiles || allProfiles.length === 0) {
        toast.error('No users found. Make sure your partner has signed up first.');
        return;
      }

      // Find matching profile - check both lowercase versions
      const inviterProfile = allProfiles?.find(profile => {
        const profilePattern = profile.user_id.replace(/-/g, '').toLowerCase();
        console.log('Checking profile:', profile.user_id, 'Pattern:', profilePattern, 'Starts with search:', profilePattern.startsWith(searchPattern));
        return profilePattern.startsWith(searchPattern);
      });

      console.log('Found inviter profile:', inviterProfile);

      if (!inviterProfile) {
        toast.error(`Invalid invite code "${joinCode}". Make sure your partner has created their account and shared the correct code.`);
        return;
      }

      const inviterUserId = inviterProfile.user_id;
      
      // Check if this user exists and if there's already a partnership
      const { data: existingPartnership } = await supabase
        .from('partnerships')
        .select('*')
        .or(`and(user1_id.eq.${user.id},user2_id.eq.${inviterUserId}),and(user1_id.eq.${inviterUserId},user2_id.eq.${user.id})`)
        .single();

      if (existingPartnership) {
        toast.error('Partnership already exists with this user');
        return;
      }

      // Create new partnership with the inviter as user1 and current user as user2
      const { error } = await supabase
        .from('partnerships')
        .insert({
          user1_id: inviterUserId,
          user2_id: user.id,
          status: 'accepted' // Auto-accept when joining via code
        });

      if (error) throw error;

      // Update profiles to link partners
      await supabase
        .from('profiles')
        .update({ partner_id: user.id })
        .eq('user_id', inviterUserId);

      await supabase
        .from('profiles')
        .update({ partner_id: inviterUserId })
        .eq('user_id', user.id);

      toast.success('Successfully joined partnership!');
      setJoinCode('');
      await loadPartnerships();
    } catch (error) {
      console.error('Error joining partnership:', error);
      toast.error('Failed to join partnership. Check the invite code.');
    } finally {
      setJoiningPartnership(false);
    }
  };

  const acceptPartnership = async (partnershipId: string) => {
    try {
      const { error } = await supabase
        .from('partnerships')
        .update({ status: 'accepted' })
        .eq('id', partnershipId);

      if (error) throw error;

      // Update partner_id in profiles
      const partnership = partnerships.find(p => p.id === partnershipId);
      if (partnership) {
        const partnerId = partnership.user1_id === user?.id ? partnership.user2_id : partnership.user1_id;
        
        await supabase
          .from('profiles')
          .update({ partner_id: user?.id })
          .eq('user_id', partnerId);

        await supabase
          .from('profiles')
          .update({ partner_id: partnerId })
          .eq('user_id', user?.id);
      }

      toast.success('Partnership accepted!');
      await loadPartnerships();
    } catch (error) {
      console.error('Error accepting partnership:', error);
      toast.error('Failed to accept partnership');
    }
  };

  const deletePartnership = async (partnershipId: string) => {
    try {
      const partnership = partnerships.find(p => p.id === partnershipId);
      if (partnership) {
        const partnerId = partnership.user1_id === user?.id ? partnership.user2_id : partnership.user1_id;
        
        // Remove partner_id from profiles
        await supabase
          .from('profiles')
          .update({ partner_id: null })
          .eq('user_id', partnerId);

        await supabase
          .from('profiles')
          .update({ partner_id: null })
          .eq('user_id', user?.id);
      }

      const { error } = await supabase
        .from('partnerships')
        .delete()
        .eq('id', partnershipId);

      if (error) throw error;

      toast.success('Partnership ended');
      await loadPartnerships();
    } catch (error) {
      console.error('Error deleting partnership:', error);
      toast.error('Failed to end partnership');
    }
  };

  const activePartnership = partnerships.find(p => p.status === 'accepted');
  const pendingPartnerships = partnerships.filter(p => p.status === 'pending');

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-pulse">Loading partnerships...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Partnership */}
      {activePartnership && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Heart className="h-5 w-5" />
              Connected Partner
            </CardTitle>
            <CardDescription className="text-green-600">
              You're connected and sharing your love journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            {partnerProfiles.map(profile => (
              <div key={profile.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Heart className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">{profile.display_name}</p>
                    <p className="text-sm text-green-600">Partner since {new Date(activePartnership.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deletePartnership(activePartnership.id)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  End Partnership
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Pending Partnerships */}
      {pendingPartnerships.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <Clock className="h-5 w-5" />
              Pending Invitations
            </CardTitle>
            <CardDescription className="text-amber-600">
              Partnership requests waiting for your response
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingPartnerships.map(partnership => {
              const isInvitee = partnership.user2_id === user?.id;
              const partnerProfile = partnerProfiles.find(p => 
                p.user_id === (isInvitee ? partnership.user1_id : partnership.user2_id)
              );
              
              return (
                <div key={partnership.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <UserPlus className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {partnerProfile?.display_name || 'Unknown User'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isInvitee ? 'Wants to connect with you' : 'Waiting for response'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {isInvitee && (
                      <Button
                        size="sm"
                        onClick={() => acceptPartnership(partnership.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Accept
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deletePartnership(partnership.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      {isInvitee ? 'Decline' : 'Cancel'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* No Active Partnership */}
      {!activePartnership && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Connect with Your Partner
            </CardTitle>
            <CardDescription>
              Share your love journey by connecting with your partner
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Send Invitation */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Share Your Invite Link</Label>
              <p className="text-sm text-muted-foreground">
                Send this link to your partner so they can connect with you
              </p>
              <div className="flex gap-2">
                <div className="flex-1 p-3 bg-muted rounded-lg text-sm font-mono break-all">
                  {`${window.location.origin}?invite=${inviteCode}`}
                </div>
                <Button onClick={copyInviteLink} variant="outline" size="icon">
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your invite code: <span className="font-mono font-semibold">{inviteCode}</span>
              </p>
            </div>

            <Separator />

            {/* Join with Code */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Join Using Invite Code</Label>
              <p className="text-sm text-muted-foreground">
                Enter your partner's invite code to connect
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter invite code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  className="font-mono"
                />
                <Button 
                  onClick={joinWithCode}
                  disabled={!joinCode.trim() || joiningPartnership}
                  className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
                >
                  {joiningPartnership ? 'Joining...' : 'Join'}
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">How it works:</p>
                <ul className="mt-1 text-xs space-y-1">
                  <li>• Share your invite link with your partner</li>
                  <li>• They can click the link or enter your code manually</li>
                  <li>• Once connected, you can track each other's moods, send messages, and plan surprises together</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}