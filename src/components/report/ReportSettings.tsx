
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportSetting, fetchSettings, createSetting, updateSetting, deleteSetting } from "@/services/reportSettingsService";
import { supabase } from "@/integrations/supabase/client";

export const ReportSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<ReportSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newSettingName, setNewSettingName] = useState("");
  const [newSettingValue, setNewSettingValue] = useState("");
  const [editSettingId, setEditSettingId] = useState<string | null>(null);
  const [editSettingValue, setEditSettingValue] = useState("");
  const [activeTab, setActiveTab] = useState("view");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "disconnected">("checking");

  // Check Supabase connection and authentication status
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Simple ping to verify connection
        const { data } = await supabase.from("report_settings").select("count").limit(1);
        setConnectionStatus("connected");
        
        // Check authentication status
        const session = await supabase.auth.getSession();
        setIsAuthenticated(!!session.data.session);
      } catch (error) {
        console.error("Database connection error:", error);
        setConnectionStatus("disconnected");
      }
    };

    checkConnection();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const data = await fetchSettings();
        setSettings(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred while fetching settings");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (connectionStatus === "connected") {
      loadSettings();
    }
  }, [connectionStatus]);

  const handleCreateSetting = async () => {
    if (!newSettingName.trim() || !isAuthenticated) {
      toast({
        title: "Invalid Input",
        description: !isAuthenticated 
          ? "You must be logged in to create settings"
          : "Please provide both a name and value",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const newSetting = await createSetting(newSettingName, newSettingValue);
      setSettings([...settings, newSetting]);
      setNewSettingName("");
      setNewSettingValue("");
      setActiveTab("view");
      toast({
        title: "Success",
        description: "Setting created successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create setting",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startEditSetting = (setting: ReportSetting) => {
    setEditSettingId(setting.id);
    setEditSettingValue(setting.value);
  };

  const cancelEditSetting = () => {
    setEditSettingId(null);
    setEditSettingValue("");
  };

  const handleUpdateSetting = async (id: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to update settings",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      await updateSetting(id, editSettingValue);
      setSettings(settings.map(s => s.id === id ? { ...s, value: editSettingValue } : s));
      setEditSettingId(null);
      toast({
        title: "Success",
        description: "Setting updated successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update setting",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSetting = async (id: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to delete settings",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      await deleteSetting(id);
      setSettings(settings.filter(s => s.id !== id));
      toast({
        title: "Success",
        description: "Setting deleted successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete setting",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Report Settings</span>
          <div className="text-sm font-normal">
            {connectionStatus === "checking" && "Checking database connection..."}
            {connectionStatus === "connected" && (
              <span className="text-green-600 flex items-center">
                <span className="h-2 w-2 bg-green-600 rounded-full mr-2"></span>
                Connected to database
              </span>
            )}
            {connectionStatus === "disconnected" && (
              <span className="text-red-600 flex items-center">
                <span className="h-2 w-2 bg-red-600 rounded-full mr-2"></span>
                Database disconnected
              </span>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isAuthenticated && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <p className="text-yellow-700">
              You are not authenticated. You can view settings, but you won't be able to create, update, or delete them.
            </p>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="view" className="flex-1">View Settings</TabsTrigger>
            <TabsTrigger value="create" className="flex-1">Create Setting</TabsTrigger>
          </TabsList>

          <TabsContent value="view">
            {loading && settings.length === 0 ? (
              <div className="text-center py-8">Loading settings...</div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            ) : settings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No settings found. Create some settings to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settings.map((setting) => (
                    <TableRow key={setting.id}>
                      <TableCell className="font-medium">{setting.name}</TableCell>
                      <TableCell>
                        {editSettingId === setting.id ? (
                          <div className="flex space-x-2">
                            <Input
                              value={editSettingValue}
                              onChange={(e) => setEditSettingValue(e.target.value)}
                              className="max-w-xs"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleUpdateSetting(setting.id)}
                              disabled={loading || !isAuthenticated}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEditSetting}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          setting.value
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {editSettingId !== setting.id && (
                          <div className="space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEditSetting(setting)}
                              disabled={!isAuthenticated}
                            >
                              Edit
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  disabled={!isAuthenticated}
                                >
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action will permanently delete the setting "{setting.name}".
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteSetting(setting.id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>

          <TabsContent value="create">
            <div className="space-y-4">
              <div>
                <label htmlFor="settingName" className="block text-sm font-medium mb-1">
                  Setting Name
                </label>
                <Input
                  id="settingName"
                  value={newSettingName}
                  onChange={(e) => setNewSettingName(e.target.value)}
                  placeholder="Enter setting name"
                  disabled={loading || !isAuthenticated}
                />
              </div>
              <div>
                <label htmlFor="settingValue" className="block text-sm font-medium mb-1">
                  Setting Value
                </label>
                <Input
                  id="settingValue"
                  value={newSettingValue}
                  onChange={(e) => setNewSettingValue(e.target.value)}
                  placeholder="Enter setting value"
                  disabled={loading || !isAuthenticated}
                />
              </div>
              <Button
                onClick={handleCreateSetting}
                disabled={loading || !newSettingName.trim() || !isAuthenticated}
              >
                Create Setting
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">
          {isAuthenticated 
            ? "You can create, update, and delete settings"
            : "Log in to manage settings"}
        </div>
      </CardFooter>
    </Card>
  );
};
