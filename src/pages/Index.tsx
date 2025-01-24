import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ModelViewer from "@/components/ModelViewer";
import PrintingParameters, { PrintParameters } from "@/components/PrintingParameters";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [parameters, setParameters] = useState<PrintParameters>({
    layerHeight: 0.2,
    infill: 20,
    scale: 100,
  });
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.name.toLowerCase().endsWith('.stl')) {
        setSelectedFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an STL file",
          variant: "destructive",
        });
      }
    }
  };

  const calculateCost = (parameters: PrintParameters) => {
    // This is a simple example calculation
    const basePrice = 10; // Base price in your currency
    const volumeMultiplier = parameters.scale / 100;
    const qualityMultiplier = 1 / parameters.layerHeight;
    const infillMultiplier = parameters.infill / 100;
    
    return (basePrice * volumeMultiplier * qualityMultiplier * infillMultiplier).toFixed(2);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">3D Print Service</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-6">
          <div className="mb-4">
            <Button asChild>
              <label className="cursor-pointer">
                Upload STL File
                <input
                  type="file"
                  className="hidden"
                  accept=".stl"
                  onChange={handleFileChange}
                />
              </label>
            </Button>
          </div>
          
          {selectedFile ? (
            <ModelViewer file={selectedFile} />
          ) : (
            <div className="model-viewer flex items-center justify-center">
              <p className="text-muted-foreground">Upload an STL file to preview</p>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Print Settings</h2>
          <PrintingParameters onParametersChange={setParameters} />
          
          <div className="mt-8 p-4 bg-secondary rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Estimated Cost</h3>
            <p className="text-3xl font-bold text-primary">
              ${calculateCost(parameters)}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Final price may vary based on additional factors
            </p>
          </div>

          <Button className="w-full mt-4" size="lg">
            Submit Print Job
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Index;