import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { BarChart, PieChart, ComposedChart, Bar, Pie, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  Bot,
  Database,
  ShoppingBag,
  Network,
  Shield,
  BarChart3,
  Plus,
  ArrowRight,
  Activity
} from "lucide-react";
import { mockAgents, mockDeployments, mockAnalyticsData } from "@/data/mockData";
import CreateAgentModal from "@/components/modals/CreateAgentModal";
import { useModels } from "@/hooks/useModels";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "@/components/ui/dialog";
import ModelForm from "@/components/models/ModelForm";
import { useAgents } from "@/hooks/useAgents";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("overview");
  const [createAgentOpen, setCreateAgentOpen] = useState(false);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const { models, isLoading: modelsLoading, createModel, updateModel, deleteModel } = useModels();
  const { agents, isLoading, createAgent, updateAgent, isCreating, isUpdating } = useAgents();
  console.log(agents)

  const pieColors = ["#9b87f5", "#7E69AB", "#6163FF", "#B085F5"];

  const handleCreateAgent = () => {
    navigate("/models");
    // Note: The models page should handle opening the create agent modal
  };

  const handleAddModel = () => {
    navigate("/models");
    // Note: The models page should handle opening the add model modal
  };

  const handleNewIntegration = () => {
    navigate("/integrations");
    // Note: The integrations page should handle opening the add integration modal
  };

  const handleMarketplace = () => {
    navigate("/marketplace");
  };

  const handleSaveModel = async (modelData: any) => {
    try {
      const success = await createModel(modelData);
      if (success) {
        setIsModelModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to save model:", error);
    }
  };

  const routeFunction = () => {
    window.open("http://15.206.121.90:3005", "_blank");
  };

  return (
    <div>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name.split(' ')[0]}</h1>
            <p className="text-muted-foreground">
              Here's what's happening with your AgentOne platform.
            </p>
          </div>
          {/* <Button onClick={handleCreateAgent}>
            <Plus className="mr-2 h-4 w-4" /> Create New Agent
          </Button> */}
          <Button onClick={() => routeFunction()}>
            <Plus className="mr-2 h-4 w-4" /> Create New Agent
          </Button>
        </div>

        <CreateAgentModal
          open={createAgentOpen}
          onClose={() => setCreateAgentOpen(false)}
          onCreated={agent => {
            console.log("Agent created", agent);
          }}
        />

        <Tabs defaultValue="overview" className="animate-fade-in" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="deployments">Deployments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Agents"
                value={mockAgents.length.toString()}
                description="Active on platform"
                icon={<Bot className="h-5 w-5" />}
                trend="+2 from last month"
                positive={true}
              />
              <StatsCard
                title="Active Requests"
                value={mockAnalyticsData.totalRequests.toLocaleString()}
                description="Last 30 days"
                icon={<Activity className="h-5 w-5" />}
                trend="+15% from last month"
                positive={true}
              />
              <StatsCard
                title="Error Rate"
                value={`${(mockAnalyticsData.errorRate * 100).toFixed(1)}%`}
                description="Platform wide"
                icon={<Shield className="h-5 w-5" />}
                trend="-0.5% from last month"
                positive={true}
              />
              <StatsCard
                title="Active Users"
                value={mockAnalyticsData.activeUsers.toString()}
                description="Currently using platform"
                icon={<Database className="h-5 w-5" />}
                trend="+12 from last month"
                positive={true}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle>Request Trends</CardTitle>
                  <CardDescription>
                    Number of requests over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={mockAnalyticsData.requestsOverTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="requests" fill="#9b87f5" />
                      <Line type="monotone" dataKey="requests" stroke="#7E69AB" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Agent Usage</CardTitle>
                  <CardDescription>
                    Distribution by agent type
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockAnalyticsData.agentUsage}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {mockAnalyticsData.agentUsage.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Agents</CardTitle>
                  <CardDescription>
                    Your recently created or updated agents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {agents.length > 0 ? (
                      agents.map((agent) => (
                        <div key={agent.name}>
                          <h4 className="font-medium">{agent.name}</h4>
                          <p className="text-sm text-muted-foreground">{agent.status}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No agents found.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common operations you might need
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="flex flex-col h-auto py-4 justify-center items-center" onClick={() => routeFunction()}>
                      <Bot className="h-6 w-6 mb-2" />
                      <span>Create Agent</span>
                    </Button>
                    {/* <Button onClick={() => routeFunction()}>
                      <Plus className="mr-2 h-4 w-4" /> Create New Agent
                    </Button> */}
                    <Button variant="outline" onClick={handleAddModel} className="flex flex-col h-auto py-4 justify-center items-center">
                      <Database className="h-6 w-6 mb-2" />
                      <span>Add Model</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-auto py-4 justify-center items-center" onClick={handleNewIntegration}>
                      <Network className="h-6 w-6 mb-2" />
                      <span>New Integration</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-auto py-4 justify-center items-center" onClick={handleMarketplace}>
                      <ShoppingBag className="h-6 w-6 mb-2" />
                      <span>Marketplace</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Agents</CardTitle>
                <CardDescription>Manage your AI agents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agents.map((agent) => (
                    <div key={agent.agent_id} className="flex items-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4 bg-primary/10">
                        <Bot className="text-primary" size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{agent.agent_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {agent.is_active ? "Active" : "Inactive"}
                        </p>
                      </div>
                      <Link to="/agents">
                        <Button variant="ghost" size="icon">
                          <ArrowRight size={16} />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Request Metrics</CardTitle>
                  <CardDescription>Performance metrics for your platform</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockAnalyticsData.requestsOverTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="requests" fill="#9b87f5" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Agent Distribution</CardTitle>
                  <CardDescription>Usage distribution by agent</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockAnalyticsData.agentUsage}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {mockAnalyticsData.agentUsage.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Statistics</CardTitle>
                <CardDescription>System-wide metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground">Average Response Time</h3>
                    <p className="text-2xl font-bold">{mockAnalyticsData.avgResponseTime}s</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground">Error Rate</h3>
                    <p className="text-2xl font-bold">{(mockAnalyticsData.errorRate * 100).toFixed(1)}%</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Requests</h3>
                    <p className="text-2xl font-bold">{mockAnalyticsData.totalRequests.toLocaleString()}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground">Active Users</h3>
                    <p className="text-2xl font-bold">{mockAnalyticsData.activeUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deployments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Deployments</CardTitle>
                <CardDescription>Current infrastructure deployments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDeployments.map((deployment) => (
                    <div key={deployment.id} className="p-4 border rounded-lg">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-lg">{deployment.name}</h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className={cn(
                              "text-xs px-2 py-1 rounded-full",
                              deployment.status === 'running' ? "bg-green-100 text-green-800" :
                                deployment.status === 'deploying' ? "bg-blue-100 text-blue-800" :
                                  deployment.status === 'stopped' ? "bg-yellow-100 text-yellow-800" :
                                    "bg-red-100 text-red-800"
                            )}>
                              {deployment.status.charAt(0).toUpperCase() + deployment.status.slice(1)}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                              {deployment.environment}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                              {deployment.type}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Manage</Button>
                          <Button variant="outline" size="sm">Logs</Button>
                          <Button size="sm">Details</Button>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">CPU</p>
                          <p className="font-medium">{deployment.resources.cpu}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Memory</p>
                          <p className="font-medium">{deployment.resources.memory}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Storage</p>
                          <p className="font-medium">{deployment.resources.storage}</p>
                        </div>
                        {deployment.resources.gpu && (
                          <div>
                            <p className="text-muted-foreground">GPU</p>
                            <p className="font-medium">{deployment.resources.gpu}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Dialog open={isModelModalOpen} onOpenChange={setIsModelModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Model</DialogTitle>
            <DialogDescription>
              Register a new foundation model in your system
            </DialogDescription>
          </DialogHeader>
          <ModelForm
            onSave={handleSaveModel}
            onCancel={() => setIsModelModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: string;
  positive: boolean;
}

const StatsCard = ({ title, value, description, icon, trend, positive }: StatsCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium">{title}</p>
            <h3 className="text-3xl font-bold mt-2">{value}</h3>
          </div>
          <div className="bg-primary/10 p-2 rounded-full">
            {icon}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        <p className={cn(
          "text-xs font-medium mt-4",
          positive ? "text-green-600" : "text-red-600"
        )}>
          {trend}
        </p>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
