import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ModelViewer from "@/components/ModelViewer";
import PrintingParameters, { PrintParameters } from "@/components/PrintingParameters";
import { useToast } from "@/components/ui/use-toast";
import { printingApi } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [parameters, setParameters] = useState<PrintParameters>({
    layerHeight: 0.2,
    infill: 20,
    scale: 100,
  });
  const { toast } = useToast();

  const calculateCostMutation = useMutation({
    mutationFn: printingApi.calculateCost,
    onError: (error) => {
      toast({
        title: "Error calculating cost",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const submitJobMutation = useMutation({
    mutationFn: printingApi.submitPrintJob,
    onSuccess: () => {
      toast({
        title: "Print job submitted",
        description: "Your print job has been submitted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error submitting print job",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.name.toLowerCase().endsWith('.stl')) {
        setSelectedFile(file);
        // Recalculate cost when file changes
        calculateCostMutation.mutate(parameters);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an STL file",
          variant: "destructive",
        });
      }
    }
  };

  const handleParametersChange = (newParameters: PrintParameters) => {
    setParameters(newParameters);
    // Recalculate cost when parameters change
    calculateCostMutation.mutate(newParameters);
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please upload an STL file first",
        variant: "destructive",
      });
      return;
    }

    submitJobMutation.mutate({
      file: selectedFile,
      parameters,
    });
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
            <div className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Upload an STL file to preview</p>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Print Settings</h2>
          <PrintingParameters onParametersChange={handleParametersChange} />
          
          <div className="mt-8 p-4 bg-secondary rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Estimated Cost</h3>
            <p className="text-3xl font-bold text-primary">
              ${calculateCostMutation.data?.cost.toFixed(2) ?? '0.00'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Final price may vary based on additional factors
            </p>
          </div>

          <Button 
            className="w-full mt-4" 
            size="lg"
            onClick={handleSubmit}
            disabled={!selectedFile || submitJobMutation.isPending}
          >
            {submitJobMutation.isPending ? 'Submitting...' : 'Submit Print Job'}
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Index;