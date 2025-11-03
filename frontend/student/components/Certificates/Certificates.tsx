import React from 'react';
import { Award, Download, Star, Calendar, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Certificates: React.FC = () => {
  const { user } = useAuth();

  const availableCertificates = [
    {
      id: 'owasp-top-10',
      title: 'OWASP Top 10 Security Risks',
      description: 'Complete understanding of the most critical web application security risks',
      requirements: [
        'Complete all 10 OWASP modules',
        'Pass module tests with 80% or higher',
        'Complete at least 5 hands-on labs',
        'Pass final certification exam'
      ],
      progress: 30,
      earned: false,
      estimatedHours: 20
    },
    {
      id: 'web-app-security',
      title: 'Web Application Security Fundamentals',
      description: 'Comprehensive knowledge of web application security principles and practices',
      requirements: [
        'Complete assessment test',
        'Finish penetration testing modules',
        'Complete secure coding practices',
        'Demonstrate practical skills'
      ],
      progress: 15,
      earned: false,
      estimatedHours: 30
    },
    {
      id: 'ethical-hacking',
      title: 'Certified Ethical Hacker (Prep)',
      description: 'Preparation for ethical hacking certification with hands-on experience',
      requirements: [
        'Complete advanced security modules',
        'Master penetration testing tools',
        'Complete capstone project',
        'Pass comprehensive exam'
      ],
      progress: 5,
      earned: false,
      estimatedHours: 50
    }
  ];

  const earnedCertificates = user?.certificates || [];

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-4">Certificates</h1>
          <p className="text-muted">
            Earn industry-recognized certificates by completing courses and demonstrating your cybersecurity skills
          </p>
        </div>

        {/* Earned Certificates */}
        {earnedCertificates.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-6">Your Certificates</h2>
            <div className="grid gap-6">
              {earnedCertificates.map((certificateEntry: string, idx: number) => {
                // Support either stored certificate IDs (matching availableCertificates[].id)
                // or public URLs (uploaded certificate image links). If it's a URL, render a generic earned card with download link.
                const isUrl = typeof certificateEntry === 'string' && (certificateEntry.startsWith('http://') || certificateEntry.startsWith('https://'));
                const certificate = !isUrl ? availableCertificates.find(c => c.id === certificateEntry) : null;

                if (!isUrl && !certificate) return null;

                if (isUrl) {
                  return (
                    <div key={`url-${idx}`} className="bg-card border border-card rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="accent-amber p-3 rounded-lg">
                            <Award className="h-8 w-8 text-contrast" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-primary">Certificate</h3>
                            <p className="text-muted">Digital certificate issued by the platform</p>
                            <div className="flex items-center space-x-2 mt-2 text-sm text-low">
                              <Calendar className="h-4 w-4" />
                              <span>Issued recently</span>
                            </div>
                          </div>
                        </div>
                        <a href={certificateEntry} target="_blank" rel="noreferrer" className="flex items-center space-x-2 btn-primary btn-primary-rounded">
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </a>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={certificate!.id} className="bg-card border border-card rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="accent-emerald p-3 rounded-lg">
                          <Award className="h-8 w-8 text-contrast" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-primary">{certificate!.title}</h3>
                          <p className="text-muted">{certificate!.description}</p>
                          <div className="flex items-center space-x-2 mt-2 text-sm text-low">
                            <Calendar className="h-4 w-4" />
                            <span>Earned on March 15, 2024</span>
                          </div>
                        </div>
                      </div>
                      <button className="flex items-center space-x-2 btn-cta btn-primary-rounded">
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Available Certificates */}
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-6">Available Certificates</h2>
          <div className="grid gap-6">
            {availableCertificates.map((certificate) => {
              const isEarned = earnedCertificates.includes(certificate.id) || earnedCertificates.some((e: string) => typeof e === 'string' && e.includes(certificate.id));
              
              return (
                <div key={certificate.id} className="bg-card rounded-lg shadow border border-card overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${isEarned ? 'accent-emerald' : 'bg-muted'}`}>
                          <Award className={`h-8 w-8 ${isEarned ? 'text-contrast' : 'text-muted'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-xl font-bold text-primary">{certificate.title}</h3>
                            {isEarned && <CheckCircle className="h-5 w-5 text-contrast" />}
                          </div>
                          <p className="text-muted mb-4">{certificate.description}</p>
                          
                          <div className="flex items-center space-x-6 text-sm text-low mb-4">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4" />
                              <span>Professional Level</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>~{certificate.estimatedHours} hours</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {!isEarned && (
                        <div className="text-right">
                          <div className="text-2xl font-bold text-accent">{certificate.progress}%</div>
                          <div className="text-low text-sm">Complete</div>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {!isEarned && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-low mb-1">
                          <span>Progress</span>
                          <span>{certificate.progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="accent-amber h-2 rounded-full transition-all duration-300"
                            style={{ width: `${certificate.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Requirements */}
                    <div className="border-t border-card pt-4">
                      <h4 className="font-medium text-primary mb-3">Requirements</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {certificate.requirements.map((requirement, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <div className="h-2 w-2 bg-muted rounded-full"></div>
                            <span className="text-muted">{requirement}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-6">
                      {isEarned ? (
                        <button className="w-full btn-cta py-3 rounded-lg transition-colors flex items-center justify-center space-x-2">
                          <Download className="h-4 w-4" />
                          <span>Download Certificate</span>
                        </button>
                      ) : (
                        <button className="w-full btn-primary py-3 rounded-lg">
                          Continue Learning
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certificate Info */}
        <div className="mt-8 bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="font-bold text-slate-100 mb-2">About Our Certificates</h3>
          <div className="text-slate-300 space-y-2">
            <p>• Industry-recognized certificates that validate your cybersecurity skills</p>
            <p>• Digital certificates with verification codes for employer validation</p>
            <p>• Continuing education credits for professional development</p>
            <p>• LinkedIn integration to showcase your achievements</p>
            <p>• Regular updates to match current industry standards</p>
          </div>
        </div>
      </div>
    </div>
  );
};