import { Question } from '../types.js';

export const assessmentQuestions: Question[] = [
  {
    id: '1',
    question: 'What does CIA stand for in cybersecurity?',
    options: ['Central Intelligence Agency', 'Confidentiality, Integrity, Availability', 'Cyber Intelligence Analysis', 'Computer Information Assurance'],
    correctAnswer: 1,
    explanation: 'CIA in cybersecurity refers to the three fundamental principles: Confidentiality, Integrity, and Availability.',
    difficulty: 'easy'
  },
  {
    id: '2',
    question: 'Which of the following is NOT a type of malware?',
    options: ['Virus', 'Trojan', 'Firewall', 'Ransomware'],
    correctAnswer: 2,
    explanation: 'A firewall is a security system that monitors network traffic, not a type of malware.',
    difficulty: 'easy'
  },
  {
    id: '3',
    question: 'What is SQL injection?',
    options: ['A type of network attack', 'A method to inject malicious SQL code into applications', 'A database optimization technique', 'A type of encryption'],
    correctAnswer: 1,
    explanation: 'SQL injection is a code injection technique that attackers use to exploit vulnerabilities in applications.',
    difficulty: 'medium'
  },
  {
    id: '4',
    question: 'What is the primary purpose of encryption?',
    options: ['Speed up data transfer', 'Compress data', 'Protect data confidentiality', 'Reduce storage space'],
    correctAnswer: 2,
    explanation: 'Encryption transforms data into an unreadable format to protect its confidentiality.',
    difficulty: 'easy'
  },
  {
    id: '5',
    question: 'Which port is commonly used for HTTPS?',
    options: ['80', '443', '22', '21'],
    correctAnswer: 1,
    explanation: 'Port 443 is the standard port for HTTPS (HTTP Secure) connections.',
    difficulty: 'medium'
  },
  {
    id: '6',
    question: 'What is a zero-day vulnerability?',
    options: ['A vulnerability that has been patched', 'A vulnerability unknown to security vendors', 'A vulnerability in day-zero systems', 'A type of denial of service attack'],
    correctAnswer: 1,
    explanation: 'A zero-day vulnerability is a security flaw that is unknown to security vendors and has no available patch.',
    difficulty: 'hard'
  },
  {
    id: '7',
    question: 'What is the principle of least privilege?',
    options: ['Giving users maximum access', 'Giving users only the access they need', 'No access for any users', 'Admin access for all users'],
    correctAnswer: 1,
    explanation: 'The principle of least privilege means giving users only the minimum level of access necessary to perform their jobs.',
    difficulty: 'medium'
  },
  {
    id: '8',
    question: 'Which encryption algorithm is considered symmetric?',
    options: ['RSA', 'AES', 'ECC', 'DSA'],
    correctAnswer: 1,
    explanation: 'AES (Advanced Encryption Standard) is a symmetric encryption algorithm, meaning the same key is used for encryption and decryption.',
    difficulty: 'medium'
  },
  {
    id: '9',
    question: 'What is phishing?',
    options: ['A type of malware', 'A social engineering attack to steal sensitive information', 'A network scanning technique', 'A password cracking tool'],
    correctAnswer: 1,
    explanation: 'Phishing is a social engineering attack where attackers attempt to trick users into revealing sensitive information.',
    difficulty: 'easy'
  },
  {
    id: '10',
    question: 'What is a firewall?',
    options: ['A type of virus', 'A network security system that monitors traffic', 'A password manager', 'A backup system'],
    correctAnswer: 1,
    explanation: 'A firewall is a network security system that monitors and controls incoming and outgoing network traffic.',
    difficulty: 'easy'
  }
];

export function getQuestionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Question[] {
  return assessmentQuestions.filter(q => q.difficulty === difficulty);
}

export function getRandomQuestions(count: number = 5): Question[] {
  const shuffled = [...assessmentQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getQuestionById(id: string): Question | undefined {
  return assessmentQuestions.find(q => q.id === id);
}