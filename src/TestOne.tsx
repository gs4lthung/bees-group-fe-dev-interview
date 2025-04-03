import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import { Progress } from "./components/ui/progress";

function TestOne() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [delayTime, setDelayTime] = useState(1);
  const [numbers, setNumbers] = useState<number[]>([1, 8, 3, 4, 5]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const isCancelled = useRef(false);

  const handleDelayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDelay = parseInt(event.target.value, 10);
    if (!isNaN(newDelay)) {
      setDelayTime(newDelay);
    }
  };

  async function processWithDelay(numbers: number[]): Promise<void> {
    try {
      setIsProcessing(true);
      setError(null);
      isCancelled.current = false;

      if (!Array.isArray(numbers)) {
        throw new Error("Input is not an array");
      }
      if (numbers.length === 0) {
        setCurrentNumber(null);
        setCurrentIndex(0);
        throw new Error("Array is empty");
      }

      for (let i = 0; i < numbers.length; i++) {
        if (isCancelled.current) {
          break;
        }

        if (typeof numbers[i] !== "number") {
          throw new Error("Array contains non-number elements");
        }

        await new Promise((resolve) => setTimeout(resolve, delayTime * 1000));

        if (isCancelled.current) break;

        setCurrentNumber(numbers[i]);
        setCurrentIndex(i);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error processing numbers:", error.message);
        setError(error.message);
      } else {
        console.error("Unexpected error:", error);
        setError("An unexpected error occurred");
      }
    } finally {
      setIsProcessing(false);
    }
  }

  useEffect(() => {
    processWithDelay(numbers);
  }, []);

  const handleCancel = () => {
    isCancelled.current = true;
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col items-center py-4 gap-4">
      <h2 className="text-3xl font-bold">Number Processor</h2>
      <div className="flex items-center gap-2">
        <h5 className="text-lg font-semibold">
          [
          {numbers.map((number, index) => (
            <Badge key={index} className="mx-1">
              {number}
            </Badge>
          ))}
          ]
        </h5>
      </div>
      <div className="flex items-center w-[200px] gap-2">
        <Input
          className=""
          type="number"
          min={1}
          step={1}
          value={delayTime}
          onChange={handleDelayChange}
        />
        <p className="text-lg font-semibold">seconds</p>
      </div>
      <div className="flex flex-col">
        <p className="text-lg font-semibold">
          Current: {currentNumber !== null ? currentNumber : "N/A"}
        </p>
        <Progress
          value={
            currentNumber !== null && numbers.length > 0
              ? ((currentIndex + 1) / numbers.length) * 100
              : 0
          }
          className="w-[400px]"
          max={100}
        />
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => processWithDelay(numbers)}
          disabled={isProcessing}
        >
          Start Processing
        </Button>
        {isProcessing && (
          <Button variant="destructive" onClick={handleCancel}>
            Cancel
          </Button>
        )}
      </div>
      {error && <div className="p-2 bg-red-300 rounded-xl">{error}</div>}
      <Button variant="outline" className="mt-4" onClick={() => {
        navigate("/app")
      }}>
        Go to next test
      </Button>
    </div>
    // <div className="container py-5">
    //   <div className="row justify-content-center">
    //     <div className="col-md-8 col-lg-6">
    //       <h2 className="text-center mb-4">Number Processor</h2>

    //       <div className="input-group mb-3">
    //         <input
    //           className="form-control"
    //           type="number"
    //           min={1}
    //           step={1}
    //           value={delayTime}
    //           onChange={handleDelayChange}
    //           disabled={isProcessing}
    //         />
    //         <span className="input-group-text">seconds</span>
    //       </div>

    //       <div className="text-center mb-3">
    //         <h5>
    //           [
    //           {numbers.map((number, index) => (
    //             <span key={index} className="badge bg-primary mx-1">
    //               {number}
    //             </span>
    //           ))}
    //           ]
    //         </h5>
    //       </div>

    //       <div className="progress mb-3" style={{ height: "30px" }}>
    //         <div
    //           className={`progress-bar progress-bar-striped ${
    //             isProcessing ? "progress-bar-animated" : ""
    //           }`}
    //           role="progressbar"
    //           style={{
    //             width: `${
    //               currentNumber !== null && numbers.length > 0
    //                 ? ((currentIndex + 1) / numbers.length) * 100
    //                 : 0
    //             }%`,
    //           }}
    //           aria-valuenow={
    //             currentNumber !== null && numbers.length > 0
    //               ? ((currentIndex + 1) / numbers.length) * 100
    //               : 0
    //           }
    //           aria-valuemin={0}
    //           aria-valuemax={100}
    //         >
    //           {currentNumber !== null &&
    //             `${currentNumber} (${Math.round(
    //               currentNumber !== null && numbers.length > 0
    //                 ? ((currentIndex + 1) / numbers.length) * 100
    //                 : 0
    //             )}%)`}
    //         </div>
    //       </div>

    //       <div className="d-flex justify-content-between gap-2">
    //         <button
    //           className="btn btn-primary flex-fill"
    //           onClick={() => processWithDelay(numbers)}
    //           disabled={isProcessing}
    //         >
    //           Start Processing
    //         </button>
    //         {isProcessing && (
    //           <button
    //             className="btn btn-danger flex-fill"
    //             onClick={handleCancel}
    //           >
    //             Cancel
    //           </button>
    //         )}
    //       </div>

    //       {error && (
    //         <div className="alert alert-danger text-center mt-3" role="alert">
    //           {error}
    //         </div>
    //       )}
    //       <Link to="/app" className="btn btn-secondary mt-3">
    //         Go to next test
    //       </Link>
    //     </div>
    //   </div>
    // </div>
  );
}

export default TestOne;
