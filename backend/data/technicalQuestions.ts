export interface TechnicalQuestion {
  id: string;
  company: string;
  position: string;
  difficulty: 'junior' | 'mid' | 'senior' | 'principal';
  category: string;
  question: string;
  hints: string[];
  solution: string;
  explanation: string;
  followUpQuestions?: string[];
  tags: string[];
  timeLimit: number; // in minutes
}

export const technicalQuestions: TechnicalQuestion[] = [
  {
    id: 'google-1',
    company: 'Google',
    position: 'Security Engineer',
    difficulty: 'mid',
    category: 'Web Security',
    question: `You discover that a web application is vulnerable to SQL injection. The application uses the following PHP code:

$query = "SELECT * FROM users WHERE username = '" . $_POST['username'] . "' AND password = '" . $_POST['password'] . "'";

1. Demonstrate how an attacker could bypass authentication
2. Explain the impact of this vulnerability
3. Provide a secure code implementation
4. What additional security measures would you recommend?`,
    hints: [
      "Think about how SQL comments work and how they can terminate queries early",
      "Consider what happens when you inject SQL syntax into the username field",
      "Look into prepared statements and parameterized queries",
      "Think about defense in depth - what other layers of security could help?"
    ],
    solution: `**1. Authentication Bypass:**
An attacker could use the following payload in the username field:
\`admin'--\`

This would result in the query:
\`SELECT * FROM users WHERE username = 'admin'--' AND password = ''\`

The \`--\` comments out the password check, allowing login as admin without knowing the password.

**2. Impact:**
- Complete authentication bypass
- Unauthorized access to user accounts
- Potential data exfiltration
- Privilege escalation

**3. Secure Implementation:**
\`\`\`php
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? AND password = ?");
$stmt->execute([$username, $password]);
\`\`\`

**4. Additional Security Measures:**
- Input validation and sanitization
- Rate limiting on authentication endpoints
- Account lockout policies
- Multi-factor authentication
- Regular security audits and penetration testing`,
    explanation: 'This exercise tests understanding of SQL injection vulnerabilities, secure coding practices, and defense-in-depth security strategies.',
    tags: ['sql-injection', 'authentication', 'secure-coding', 'php'],
    timeLimit: 30
  },
  {
    id: 'microsoft-1',
    company: 'Microsoft',
    position: 'Security Consultant',
    difficulty: 'senior',
    category: 'Network Security',
    question: `A company reports that their internal network is experiencing unusual traffic patterns. As a security consultant, you need to:

1. Identify the potential attack vectors
2. Recommend monitoring and detection strategies
3. Propose incident response procedures
4. Design a network segmentation strategy to prevent lateral movement

Given the following network details:
- Flat network with 200+ devices
- No network segmentation
- Basic firewall with default rules
- No intrusion detection system`,
    hints: [
      "Consider common attack patterns in flat networks",
      "Think about network visibility and monitoring tools",
      "Review the MITRE ATT&CK framework for techniques",
      "Consider zero-trust architecture principles"
    ],
    solution: `**1. Potential Attack Vectors:**
- Lateral movement through compromised endpoints
- Pass-the-hash attacks
- SMB exploitation
- ARP spoofing
- DNS tunneling
- Insider threats

**2. Monitoring and Detection:**
- Deploy Network Intrusion Detection System (NIDS)
- Implement Security Information and Event Management (SIEM)
- Network traffic analysis and baselining
- Endpoint Detection and Response (EDR)
- Log aggregation and correlation

**3. Incident Response Procedures:**
- Establish clear incident classification
- Create response playbooks for common scenarios
- Define communication protocols
- Implement containment strategies
- Evidence collection and preservation procedures

**4. Network Segmentation:**
- VLAN-based segmentation by department/function
- DMZ for public-facing services
- Database network isolation
- Strict access control lists (ACLs)
- Micro-segmentation for critical assets`,
    explanation: 'This scenario tests comprehensive network security knowledge including threat analysis, monitoring, incident response, and network architecture.',
    tags: ['network-security', 'incident-response', 'segmentation', 'monitoring'],
    timeLimit: 45
  }
];

export function getQuestionsByCompany(company: string): TechnicalQuestion[] {
  return technicalQuestions.filter(q => q.company.toLowerCase().includes(company.toLowerCase()));
}

export function getQuestionsByDifficulty(difficulty: TechnicalQuestion['difficulty']): TechnicalQuestion[] {
  return technicalQuestions.filter(q => q.difficulty === difficulty);
}

export function getQuestionsByCategory(category: string): TechnicalQuestion[] {
  return technicalQuestions.filter(q => q.category.toLowerCase().includes(category.toLowerCase()));
}

export function getRandomTechnicalQuestions(count: number = 5): TechnicalQuestion[] {
  const shuffled = [...technicalQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}