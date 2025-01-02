import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useContext, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { finalizeStripePaymentService } from "@/services";
import { Loader } from "@/components/ui/loader";

function StripePaymentReturnPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  if (!sessionId) {
    console.log("Finalizing Stripe payment with sessionId:", sessionId);

    console.error("No session ID found in the URL.");
    setError("No payment session found. Please try again.");
    return;
  }
  
  

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (sessionId) {
      async function finalizePayment() {
        try {
          const response = await finalizeStripePaymentService(sessionId);
  
          if (response?.success) {
            navigate("/student-courses");
          } else {
            setError(response?.message || "Failed to finalize payment.");
          }
        } catch (err) {
          setError("An unexpected error occurred while processing your payment.");
        } finally {
          setLoading(false);
        }
      }
  
      finalizePayment();
    } else {
      setError("No session ID found in the URL.");
      setLoading(false);
    }
  }, [sessionId, navigate]);
  

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Processing payment...</CardTitle>
          <Loader />
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Processing Payment</CardTitle>
          <p>{error}</p>
        </CardHeader>
      </Card>
    );
  }

  return null; // Redirect already handled
}

export default StripePaymentReturnPage;
