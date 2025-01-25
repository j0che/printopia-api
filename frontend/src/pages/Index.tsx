import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ModelViewer from "@/components/ModelViewer";
import PrintingParameters, { PrintParameters } from "@/components/PrintingParameters";
import { useToast } from "@/components/ui/use-toast";
import { printingApi } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [parameters, setParameters] = useState<PrintParameters>({
    layerHeight: 0.2,
    infill: 20,
    scale: 100,
  });
  const [tempFolderId, setTempFolderId] = useState<string>();
  const { toast } = useToast();

  // Query for getting price from price.json
  const priceQuery = useQuery({
    queryKey: ['price', tempFolderId],
    queryFn: () => tempFolderId ? printingApi.getPrice(tempFolderId) : null,
    enabled: !!tempFolderId,
  });

  const submitJobMutation = useMutation({
    mutationFn: printingApi.submitPrintJob,
    onSuccess: (data) => {
      setTempFolderId(data.tempFolderId);
      toast({
        title: "Files uploaded",
        description: "Your files have been uploaded and the price has been calculated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error uploading files",
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
        // Submit job when file is selected to create temp folder
        submitJobMutation.mutate({
          file,
          parameters,
        });
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
    // Resubmit job when parameters change
    if (selectedFile) {
      submitJobMutation.mutate({
        file: selectedFile,
        parameters: newParameters,
      });
    }
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
            {priceQuery.isLoading ? (
              <p className="text-3xl font-bold text-primary">Calculating...</p>
            ) : priceQuery.data ? (
              <p className="text-3xl font-bold text-primary">
                ${priceQuery.data.cost.toFixed(2)} {priceQuery.data.currency}
              </p>
            ) : (
              <p className="text-3xl font-bold text-primary">$0.00</p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              Final price may vary based on additional factors
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;