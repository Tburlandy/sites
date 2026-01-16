import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaStudio } from "@/components/dev/MediaStudio";
import { ConfigEditor } from "@/components/dev/ConfigEditor";

export default function DevStudio() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Painel Dev Studio</h1>
          <p className="text-muted-foreground">
            Gerencie mídias e configure o site através desta interface de desenvolvimento
          </p>
        </div>

        <Tabs defaultValue="medias" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="medias">Mídias</TabsTrigger>
            <TabsTrigger value="config">Config</TabsTrigger>
          </TabsList>

          <TabsContent value="medias" className="mt-6">
            <MediaStudio />
          </TabsContent>

          <TabsContent value="config" className="mt-6">
            <ConfigEditor />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

