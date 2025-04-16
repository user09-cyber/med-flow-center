
import { useEffect, useState } from "react";
import { MedicalRecord, Patient } from "@/models/types";
import apiService from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Plus,
  Search,
  User,
  Calendar,
  Pill
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function MedicalRecords() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [newRecord, setNewRecord] = useState<Partial<MedicalRecord>>({});
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch patients on component mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await apiService.getPatients();
        setPatients(data);
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      } finally {
        setIsLoadingPatients(false);
      }
    };

    fetchPatients();
  }, []);

  // Fetch medical records when a patient is selected
  useEffect(() => {
    if (selectedPatient) {
      const fetchMedicalRecords = async () => {
        setIsLoadingRecords(true);
        try {
          const data = await apiService.getMedicalRecords(selectedPatient.id);
          setMedicalRecords(data);
        } catch (error) {
          console.error("Failed to fetch medical records:", error);
        } finally {
          setIsLoadingRecords(false);
        }
      };

      fetchMedicalRecords();
    } else {
      setMedicalRecords([]);
    }
  }, [selectedPatient]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRecord((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    try {
      const recordData = {
        ...newRecord,
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        prescriptions: [], // Initialize empty array for new record
      };
      
      const createdRecord = await apiService.createMedicalRecord(recordData as Omit<MedicalRecord, "id" | "createdAt" | "updatedAt">);
      setMedicalRecords((prev) => [createdRecord, ...prev]);
      setDialogOpen(false);
      setNewRecord({});
    } catch (error) {
      console.error("Failed to create medical record:", error);
    }
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    // Initialize new record with patient info
    setNewRecord({
      patientId: patient.id,
      patientName: patient.name,
      prescriptions: []
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Medical Records</h1>
        <p className="text-muted-foreground">View and manage patient medical records</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Patient List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl">Patients</CardTitle>
            <CardDescription>Select a patient to view their records</CardDescription>
            <div className="flex items-center bg-white rounded-md border px-3 mt-2">
              <Search className="h-4 w-4 text-muted-foreground mr-2" />
              <Input
                placeholder="Search patients..."
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="max-h-[600px] overflow-y-auto p-0">
            {isLoadingPatients ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-medblue"></div>
              </div>
            ) : (
              <div className="divide-y">
                {filteredPatients.length === 0 ? (
                  <p className="text-center p-4 text-muted-foreground">No patients found</p>
                ) : (
                  filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      onClick={() => selectPatient(patient)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 ${
                        selectedPatient?.id === patient.id ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-medblue" />
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">{patient.email}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Medical Records Section */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                {selectedPatient ? `${selectedPatient.name}'s Records` : "Medical Records"}
              </CardTitle>
              <CardDescription>
                {selectedPatient
                  ? `View and manage medical records for ${selectedPatient.name}`
                  : "Select a patient to view their medical records"}
              </CardDescription>
            </div>
            {selectedPatient && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-medblue hover:bg-medblue/90">
                    <Plus className="mr-2 h-4 w-4" />
                    New Record
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Medical Record</DialogTitle>
                    <DialogDescription>
                      Add a new medical record for {selectedPatient?.name}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="symptoms">Symptoms</Label>
                        <Textarea
                          id="symptoms"
                          name="symptoms"
                          value={newRecord.symptoms || ""}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="diagnosis">Diagnosis</Label>
                        <Textarea
                          id="diagnosis"
                          name="diagnosis"
                          value={newRecord.diagnosis || ""}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          value={newRecord.notes || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-medblue hover:bg-medblue/90">
                        Create Record
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </CardHeader>
          <CardContent>
            {!selectedPatient ? (
              <div className="flex flex-col items-center justify-center h-64 text-center p-4">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No patient selected</p>
                <p className="text-muted-foreground">Select a patient from the list to view their records</p>
              </div>
            ) : isLoadingRecords ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medblue"></div>
              </div>
            ) : medicalRecords.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No medical records</p>
                <p className="text-muted-foreground mb-4">
                  This patient doesn't have any medical records yet
                </p>
                <Button onClick={() => setDialogOpen(true)} className="bg-medblue hover:bg-medblue/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Record
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Accordion type="single" collapsible className="w-full">
                  {medicalRecords.map((record, index) => (
                    <AccordionItem key={record.id} value={record.id}>
                      <AccordionTrigger className="hover:bg-gray-50 px-4 py-2 rounded-md">
                        <div className="flex flex-1 items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-medblue" />
                            <span className="font-medium">Visit on {record.createdAt}</span>
                          </div>
                          <span className="text-sm text-muted-foreground mr-4">
                            {record.diagnosis}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pt-2 pb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold flex items-center gap-1 mb-2">
                              <User className="h-4 w-4" /> Patient Information
                            </h4>
                            <p className="text-sm">
                              <span className="font-medium">Name:</span> {record.patientName}
                            </p>
                            {selectedPatient && (
                              <>
                                <p className="text-sm">
                                  <span className="font-medium">Date of Birth:</span> {selectedPatient.dateOfBirth}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Blood Type:</span> {selectedPatient.bloodType || "Not specified"}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Allergies:</span> {selectedPatient.allergies?.join(", ") || "None"}
                                </p>
                              </>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold flex items-center gap-1 mb-2">
                              <Calendar className="h-4 w-4" /> Visit Details
                            </h4>
                            <p className="text-sm">
                              <span className="font-medium">Date:</span> {record.createdAt}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Last Updated:</span> {record.updatedAt}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h4 className="font-semibold">Diagnosis</h4>
                          <p className="text-sm mt-1">{record.diagnosis}</p>
                        </div>

                        <div className="mt-4">
                          <h4 className="font-semibold">Symptoms</h4>
                          <p className="text-sm mt-1">{record.symptoms}</p>
                        </div>

                        <div className="mt-4">
                          <h4 className="font-semibold flex items-center gap-1 mb-2">
                            <Pill className="h-4 w-4" /> Prescriptions
                          </h4>
                          {record.prescriptions && record.prescriptions.length > 0 ? (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Medication</TableHead>
                                  <TableHead>Dosage</TableHead>
                                  <TableHead>Frequency</TableHead>
                                  <TableHead>Duration</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {record.prescriptions.map((prescription) => (
                                  <TableRow key={prescription.id}>
                                    <TableCell className="font-medium">{prescription.medication}</TableCell>
                                    <TableCell>{prescription.dosage}</TableCell>
                                    <TableCell>{prescription.frequency}</TableCell>
                                    <TableCell>{prescription.duration}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <p className="text-sm text-muted-foreground">No prescriptions given</p>
                          )}
                        </div>

                        {record.notes && (
                          <div className="mt-4">
                            <h4 className="font-semibold">Additional Notes</h4>
                            <p className="text-sm mt-1">{record.notes}</p>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
