
import { useState } from "react";
import { InsuranceInfo, Patient } from "@/models/types";
import apiService from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertCircle,
  Check, 
  ChevronRight, 
  Clock, 
  Search, 
  ShieldCheck,
  User 
} from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

export function Insurance() {
  const [searchTerm, setSearchTerm] = useState("");
  const [insuranceInfo, setInsuranceInfo] = useState<InsuranceInfo>({
    id: "",
    provider: "",
    policyNumber: "",
    holderName: "",
    relationship: "Self",
    expiryDate: "",
    verified: false
  });
  const [verificationResult, setVerificationResult] = useState<{ verified: boolean; message?: string } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInsuranceInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleVerifyInsurance = async () => {
    setIsVerifying(true);
    setVerificationResult(null);
    
    try {
      const result = await apiService.verifyInsurance(insuranceInfo);
      setVerificationResult(result);
      setInsuranceInfo((prev) => ({ ...prev, verified: result.verified }));
    } catch (error) {
      console.error("Failed to verify insurance:", error);
      setVerificationResult({ verified: false, message: "An error occurred during verification. Please try again." });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Insurance Verification</h1>
        <p className="text-muted-foreground">Verify patient insurance coverage</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Insurance Information</CardTitle>
            <CardDescription>Enter insurance details to verify coverage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="provider">Insurance Provider</Label>
                <Input
                  id="provider"
                  name="provider"
                  value={insuranceInfo.provider}
                  onChange={handleInputChange}
                  placeholder="e.g. Blue Cross Blue Shield"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="policyNumber">Policy Number</Label>
                <Input
                  id="policyNumber"
                  name="policyNumber"
                  value={insuranceInfo.policyNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. XYZ123456789"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="holderName">Policy Holder Name</Label>
                  <Input
                    id="holderName"
                    name="holderName"
                    value={insuranceInfo.holderName}
                    onChange={handleInputChange}
                    placeholder="Full name on policy"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="relationship">Relationship to Patient</Label>
                  <Input
                    id="relationship"
                    name="relationship"
                    value={insuranceInfo.relationship}
                    onChange={handleInputChange}
                    placeholder="e.g. Self, Spouse, Parent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="groupNumber">Group Number (Optional)</Label>
                  <Input
                    id="groupNumber"
                    name="groupNumber"
                    value={insuranceInfo.groupNumber || ""}
                    onChange={handleInputChange}
                    placeholder="e.g. G12345"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    type="date"
                    value={insuranceInfo.expiryDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="coverageDetails">Coverage Details (Optional)</Label>
                <Textarea
                  id="coverageDetails"
                  name="coverageDetails"
                  value={insuranceInfo.coverageDetails || ""}
                  onChange={handleInputChange}
                  placeholder="Any additional coverage information"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleVerifyInsurance} 
              disabled={isVerifying || !insuranceInfo.provider || !insuranceInfo.policyNumber || !insuranceInfo.holderName}
              className="bg-medblue hover:bg-medblue/90 w-full"
            >
              {isVerifying ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Verify Insurance
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Verification Status</CardTitle>
            <CardDescription>Results of insurance verification</CardDescription>
          </CardHeader>
          <CardContent>
            {verificationResult === null ? (
              <div className="flex flex-col items-center justify-center h-64 text-center p-4">
                <ShieldCheck className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No verification performed yet</p>
                <p className="text-muted-foreground">
                  Enter insurance information and click "Verify Insurance" to check coverage
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {verificationResult.verified ? (
                  <Alert className="border-green-500 bg-green-50">
                    <Check className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-600">Insurance Verified</AlertTitle>
                    <AlertDescription className="text-green-700">
                      The insurance information has been verified successfully.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Verification Failed</AlertTitle>
                    <AlertDescription>
                      {verificationResult.message || "Unable to verify the insurance information. Please check the details and try again."}
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="bg-gray-50 rounded-md p-4 border">
                  <h3 className="font-semibold mb-3">Verification Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Provider:</span>
                      <span className="font-medium">{insuranceInfo.provider}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Policy Number:</span>
                      <span className="font-medium">{insuranceInfo.policyNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Holder Name:</span>
                      <span className="font-medium">{insuranceInfo.holderName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expiry Date:</span>
                      <span className="font-medium">{insuranceInfo.expiryDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className={`font-medium ${verificationResult.verified ? 'text-green-600' : 'text-red-600'}`}>
                        {verificationResult.verified ? 'Valid' : 'Invalid'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {verificationResult.verified && (
                  <div className="flex justify-end">
                    <Button className="bg-medblue hover:bg-medblue/90">
                      Save to Patient Record
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Verifications</CardTitle>
          <CardDescription>Insurance verifications performed recently</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4">
              <div className="flex items-center gap-3 mb-2 md:mb-0">
                <User className="h-8 w-8 text-medblue bg-medblue/10 p-1 rounded-full" />
                <div>
                  <p className="font-medium">John Smith</p>
                  <p className="text-sm text-muted-foreground">Blue Cross Blue Shield</p>
                </div>
              </div>
              <div className="md:text-right">
                <p className="text-sm">Policy #: BCBS-123456789</p>
                <p className="text-sm text-muted-foreground">Verified on April 12, 2025</p>
              </div>
              <Badge className="w-fit md:ml-4 mt-2 md:mt-0 bg-green-100 text-green-800 border-green-200">Valid</Badge>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4">
              <div className="flex items-center gap-3 mb-2 md:mb-0">
                <User className="h-8 w-8 text-medblue bg-medblue/10 p-1 rounded-full" />
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-sm text-muted-foreground">Aetna Health</p>
                </div>
              </div>
              <div className="md:text-right">
                <p className="text-sm">Policy #: AET-987654321</p>
                <p className="text-sm text-muted-foreground">Verified on April 10, 2025</p>
              </div>
              <Badge className="w-fit md:ml-4 mt-2 md:mt-0 bg-green-100 text-green-800 border-green-200">Valid</Badge>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4">
              <div className="flex items-center gap-3 mb-2 md:mb-0">
                <User className="h-8 w-8 text-medblue bg-medblue/10 p-1 rounded-full" />
                <div>
                  <p className="font-medium">Michael Davis</p>
                  <p className="text-sm text-muted-foreground">UnitedHealthcare</p>
                </div>
              </div>
              <div className="md:text-right">
                <p className="text-sm">Policy #: UHC-567890123</p>
                <p className="text-sm text-muted-foreground">Verified on April 8, 2025</p>
              </div>
              <Badge className="w-fit md:ml-4 mt-2 md:mt-0 bg-red-100 text-red-800 border-red-200">Expired</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Add missing Badge import
import { Badge } from "@/components/ui/badge";
