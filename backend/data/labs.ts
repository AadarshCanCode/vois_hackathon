export interface Lab {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  tools: string[];
  liveUrl?: string;
  instructions: string;
  objectives?: string[];
}

export const labs: Lab[] = [
  {
    id: 'broken-access-control',
    title: 'Broken Access Control Lab',
    description: 'Practice identifying and exploiting broken access control vulnerabilities',
    difficulty: 'beginner',
    estimatedTime: '45 minutes',
    tools: ['Browser', 'Burp Suite', 'OWASP ZAP'],
    liveUrl: 'https://testphp.vulnweb.com/listproducts.php?cat=1',
    instructions: `
# Broken Access Control Lab

## Objective
Learn to identify and exploit broken access control vulnerabilities in web applications.

## Scenario
You have been given access to a vulnerable web application that contains several access control flaws. Your task is to identify and exploit these vulnerabilities in a live environment.

## Lab Environment
- Target Application: http://vulnerable-app.lab:8080
- Live containerized environment with real vulnerabilities
- Interactive terminal with security testing tools
- Real-time objective tracking

## Exercise 1: Horizontal Privilege Escalation
1. Log in as user1
2. Navigate to the user profile page
3. Try to access other users' profiles by manipulating the URL
4. Document what sensitive information you can access

## Exercise 2: Vertical Privilege Escalation
1. As a regular user, attempt to access admin functions
2. Look for hidden admin panels or functionality
3. Try parameter manipulation to gain elevated privileges

## Exercise 3: Insecure Direct Object References
1. Find functionality that references objects by ID
2. Attempt to access objects belonging to other users
3. Test for predictable object identifiers

## Tools Usage
- Burp Suite for request interception and modification
- OWASP ZAP for automated vulnerability scanning
- Custom exploitation scripts and payloads
- Network analysis tools

## Expected Findings
- User profile information disclosure
- Admin panel access
- Unauthorized data modification capabilities`,
    objectives: [
      'Identify horizontal privilege escalation vulnerabilities',
      'Exploit vertical privilege escalation flaws',
      'Discover insecure direct object references',
      'Document security findings professionally'
    ]
  },
  {
    id: 'sql-injection',
    title: 'SQL Injection Lab',
    description: 'Hands-on practice with SQL injection vulnerabilities in various contexts',
    difficulty: 'intermediate',
    estimatedTime: '60 minutes',
    tools: ['SQLMap', 'Burp Suite', 'Browser DevTools'],
    instructions: `
# SQL Injection Lab

## Objective
Master SQL injection techniques across different injection points and database types.

## Lab Environment
- Multiple vulnerable endpoints
- Different database backends (MySQL, PostgreSQL, MSSQL)
- Various injection contexts (GET, POST, Headers, Cookies)
- Live database with sample data

## Exercise 1: Classic SQL Injection
1. Identify vulnerable input parameters
2. Extract database information using UNION queries
3. Bypass simple filters and WAF rules
4. Dump user credentials and sensitive data

## Exercise 2: Blind SQL Injection
1. Identify time-based blind injection points
2. Use conditional responses to extract data
3. Implement automated data extraction techniques
4. Optimize payload delivery for efficiency

## Exercise 3: Advanced Injection Techniques
1. Second-order SQL injection
2. DNS exfiltration techniques
3. File read/write through SQL injection
4. Command execution capabilities

## Tools and Techniques
- Manual injection with crafted payloads
- Automated scanning with SQLMap
- Custom scripts for data extraction
- Bypassing modern WAF protections

## Learning Outcomes
- Understanding of SQL injection mechanics
- Proficiency with automated tools
- Knowledge of advanced bypass techniques
- Experience with real-world scenarios`,
    objectives: [
      'Identify SQL injection vulnerabilities',
      'Exploit both classic and blind SQL injection',
      'Use automated and manual testing techniques',
      'Understand impact and mitigation strategies'
    ]
  }
];

export function getLabsByDifficulty(difficulty: Lab['difficulty']): Lab[] {
  return labs.filter(lab => lab.difficulty === difficulty);
}

export function getLabById(id: string): Lab | undefined {
  return labs.find(lab => lab.id === id);
}

export function getRandomLabs(count: number = 3): Lab[] {
  const shuffled = [...labs].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}