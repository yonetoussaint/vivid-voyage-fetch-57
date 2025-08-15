
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/RedirectAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Edit, Settings, ShoppingBag, Store, Heart, Package, User, Star, LogOut } from "lucide-react";
import ProfileOrders from "@/components/profile/ProfileOrders";
import ProfileWishlist from "@/components/profile/ProfileWishlist";
import ProfileSettings from "@/components/profile/ProfileSettings";
import ProfileProducts from "@/components/profile/ProfileProducts";
import ProfileDashboard from "@/components/profile/ProfileDashboard";
import ProfileAnalytics from "@/components/profile/ProfileAnalytics";
import { Navigate, useNavigate } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";

export default function ProfilePage() {
  const { user, signOut, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profileData, setProfileData] = useState<any>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !isLoading) {
      navigate("/auth");
      return;
    }

    const fetchProfileData = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (error) {
          console.error("Error fetching profile:", error);
          toast.error("Could not load profile data");
        } else {
          setProfileData(data);
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchProfileData();
  }, [user, isLoading, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
      console.error(error);
    }
  };

  if (isLoading || isProfileLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const userInitials = user.email ? user.email.substring(0, 2).toUpperCase() : "U";
  const userName = profileData?.username || user.email?.split("@")[0] || "User";
  
  return (
    <div className="pb-24 md:pb-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <PageContainer maxWidth="7xl" className="py-6">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <Avatar className="h-20 w-20 border-2 border-white shadow-lg">
              <AvatarImage 
                src={profileData?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} 
                alt={userName}
              />
              <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-2xl font-bold">{userName}</h1>
                <div className="flex gap-2 justify-center sm:justify-start">
                  <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                    Seller
                  </Badge>
                  {profileData?.is_verified && (
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-muted-foreground mt-1">{user.email}</p>
              <p className="text-sm mt-2 max-w-md mx-auto sm:mx-0">
                {profileData?.bio || "No bio yet"}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="flex gap-2 items-center">
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Settings</span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Account Settings</SheetTitle>
                  </SheetHeader>
                  <ProfileSettings user={user} profile={profileData} />
                </SheetContent>
              </Sheet>
              
              <Button variant="outline" size="sm" className="flex gap-2 items-center" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Main Content */}
      <PageContainer maxWidth="7xl" className="py-6">
        {/* Stats Cards - Simplified for mobile */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card className="shadow-sm">
            <CardContent className="p-3 flex flex-row items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <ShoppingBag className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-lg font-bold">23</p>
                <p className="text-xs text-muted-foreground">Orders</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-3 flex flex-row items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Store className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-lg font-bold">12</p>
                <p className="text-xs text-muted-foreground">Products</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-3 flex flex-row items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-full">
                <Star className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <p className="text-lg font-bold">4.8</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-3 flex flex-row items-center gap-3">
              <div className="bg-red-100 p-2 rounded-full">
                <Heart className="h-4 w-4 text-red-500" />
              </div>
              <div>
                <p className="text-lg font-bold">56</p>
                <p className="text-xs text-muted-foreground">Wishlist</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs - Mobile optimized */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full h-auto flex mb-4 overflow-x-auto scrollbar-hide rounded-lg p-1 bg-muted/30">
            <TabsTrigger value="dashboard" className="flex-1 rounded-md">Dashboard</TabsTrigger>
            <TabsTrigger value="orders" className="flex-1 rounded-md">Orders</TabsTrigger>
            <TabsTrigger value="wishlist" className="flex-1 rounded-md">Wishlist</TabsTrigger>
            <TabsTrigger value="products" className="flex-1 rounded-md">Products</TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1 rounded-md">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <ProfileDashboard user={user} profile={profileData} />
          </TabsContent>
          
          <TabsContent value="orders">
            <ProfileOrders user={user} />
          </TabsContent>
          
          <TabsContent value="wishlist">
            <ProfileWishlist user={user} />
          </TabsContent>
          
          <TabsContent value="products">
            <ProfileProducts user={user} />
          </TabsContent>
          
          <TabsContent value="analytics">
            <ProfileAnalytics user={user} />
          </TabsContent>
        </Tabs>
      </PageContainer>
    </div>
  );
}