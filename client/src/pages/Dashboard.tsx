import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskBoard } from '@/components/TaskBoard';
import { Feed } from '@/components/Feed';

export function Dashboard() {
  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="feed">Feed</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks">
          <TaskBoard />
        </TabsContent>
        <TabsContent value="feed">
          <Feed />
        </TabsContent>
      </Tabs>
    </div>
  );
}