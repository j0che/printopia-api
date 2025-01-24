import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";

interface PrintingParametersProps {
  onParametersChange: (parameters: PrintParameters) => void;
}

export interface PrintParameters {
  layerHeight: number;
  infill: number;
  scale: number;
}

const PrintingParameters = ({ onParametersChange }: PrintingParametersProps) => {
  const handleLayerHeightChange = (value: number[]) => {
    onParametersChange({
      layerHeight: value[0],
      infill: 20,
      scale: 100
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Layer Height (mm)</Label>
        <Slider
          defaultValue={[0.2]}
          max={0.4}
          min={0.1}
          step={0.1}
          onValueChange={handleLayerHeightChange}
        />
        <div className="text-sm text-muted-foreground">
          Finer layers mean better quality but longer print time
        </div>
      </div>

      <div className="space-y-2">
        <Label>Infill (%)</Label>
        <Input
          type="number"
          placeholder="20"
          min={0}
          max={100}
          onChange={(e) => {
            onParametersChange({
              layerHeight: 0.2,
              infill: Number(e.target.value),
              scale: 100
            });
          }}
        />
      </div>

      <div className="space-y-2">
        <Label>Scale (%)</Label>
        <Input
          type="number"
          placeholder="100"
          min={1}
          max={1000}
          onChange={(e) => {
            onParametersChange({
              layerHeight: 0.2,
              infill: 20,
              scale: Number(e.target.value)
            });
          }}
        />
      </div>
    </div>
  );
};

export default PrintingParameters;