import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Building2, Key, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { apiClient } from '@/core/api/http/axios-client';

export function CandidateLoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    applicationNo: '',
    dateOfBirth: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post('/candidate-exam/login', formData);
      if (response.data.success) {
        // We will store candidate token in localStorage for exam session
        localStorage.setItem('candidate_exam_token', response.data.data.sessionToken);
        localStorage.setItem('candidate_session_id', response.data.data.sessionId);
        localStorage.setItem('candidate_exam_id', response.data.data.exam._id);
        localStorage.setItem('candidate_exam_meta', JSON.stringify(response.data.data.exam));
        localStorage.setItem('candidate_info', JSON.stringify(response.data.data.candidate));
        
        // Navigate to instructions
        navigate('/exam/instructions');
      }
    } catch (err: any) {
      if (err.message) {
        setError(err.message);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="absolute top-4 right-4">
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-primary p-3 rounded-xl shadow-lg">
            <Building2 className="h-10 w-10 text-primary-foreground" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">
          Candidate Login
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          Enter your Application No and Date of Birth
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border-0 shadow-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to access your assigned exam</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="applicationNo">Application Number</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <Input
                    id="applicationNo"
                    name="applicationNo"
                    type="text"
                    required
                    className="pl-10 h-12"
                    placeholder="e.g. APP-2026-1029"
                    value={formData.applicationNo}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth (Password)</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <Key className="h-5 w-5" />
                  </div>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    required
                    className="pl-10 h-12"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-base font-medium" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Signing in...
                  </>
                ) : (
                  'Start Exam'
                )}
              </Button>

              <div className="text-center text-sm mt-6">
                <span className="text-muted-foreground">Go back to </span>
                <Link to="/auth/login" className="text-primary font-medium hover:underline">
                  Main Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
