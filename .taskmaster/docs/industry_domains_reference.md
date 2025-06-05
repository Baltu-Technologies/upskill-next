# Industry Domains Reference

## Overview
This document defines the 16 industry categories and their subdomains for the Upskill Career Exploration system. Each category represents an economic sector where multiple core technology domains are applied.

## Structure
- **Industry Categories**: 16 broad economic sectors
- **Industry Subdomains**: 4-5 specialized areas within each category
- **Total Subdomains**: 80 specialized industry areas

## Usage Guidelines
1. **Industry landing pages**: Each category becomes a page describing sector overview, significance, and core technologies
2. **Sub-industry tags**: Subdomains provide filtering tags for jobs, courses, and projects  
3. **Learner navigation**: Students explore technology → industry → career pathway flow

---

## Industry Domains and Subdomains

### 1. Advanced Manufacturing & Industrial Production
- Semiconductor fabrication
- Electronics assembly and testing
- Precision and CNC machining
- Additive manufacturing job shops
- Contract and high-volume manufacturing lines

### 2. Aerospace & Defense
- Commercial aircraft manufacturing
- Spacecraft and launch-vehicle production
- Satellite design and operations
- Unmanned aerial systems (UAS)
- Defense systems integration and MRO

### 3. Automotive, Mobility & Transportation
- Electric-vehicle manufacturing
- Autonomous-vehicle development
- Rail and transit systems
- Vehicle charging and fueling infrastructure
- Fleet telematics and logistics services

### 4. Energy Generation & Utilities
- Solar and wind power plants
- Hydro and geothermal facilities
- Conventional thermal generation
- Transmission and grid-operator control centers
- Micro-grid and distributed-energy projects

### 5. Sustainable & Green Solutions
- Carbon capture and utilization projects
- Waste-to-energy and advanced recycling
- Water treatment and desalination plants
- Energy-efficiency retrofits and demand-response services
- Bio-based and circular-economy materials production

### 6. Data Centers & Digital Infrastructure
- Hyperscale data-center facilities
- Edge and micro-data centers
- Colocation and managed-hosting providers
- Critical-facility operations and maintenance services
- Structured-cabling and fiber backhaul construction

### 7. Telecommunications & Networking
- 5G and future wireless network operators
- Fiber-optic network build-outs
- Satellite broadband and backhaul services
- Regional and municipal broadband projects
- IoT connectivity platform providers

### 8. Smart Cities & Built Environment
- Intelligent transportation systems
- Connected street-lighting networks
- Building-automation and energy-management services
- Municipal IoT sensor deployments
- Urban analytics and command centers

### 9. Construction Technology & Industrial EPC
- Engineering-procurement-construction (EPC) megaprojects
- Building information modeling (BIM) services
- Modular and off-site construction fabrication
- Robotics and automation for construction sites
- Digital project-management platforms

### 10. Healthcare & Medical Technology
- Medical-device manufacturing
- Hospital IT and informatics systems
- Digital-health and telemedicine platforms
- Clinical laboratory automation
- Imaging equipment and diagnostic tools

### 11. Logistics, Warehousing & Supply Chain
- Automated fulfillment centers
- Robotics-enabled third-party logistics (3PL) warehouses
- Cold-chain monitoring systems
- Smart-port and terminal operations
- Fleet-management and last-mile delivery services

### 12. Agriculture & Food Technology
- Precision-agriculture sensing and analytics
- Indoor and controlled-environment farming
- Agricultural drone services
- Automated food-processing equipment
- Supply-chain traceability platforms

### 13. Mining, Materials & Natural Resources
- Smart-mining equipment and operations
- Mineral and metal refinement facilities
- Battery-materials extraction projects
- Resource-monitoring IoT networks
- Environmental remediation services

### 14. Consumer Electronics & Smart Products
- Smartphone and tablet manufacturing
- Wearables and fitness devices
- Home-automation and smart-appliance production
- Personal robotics and drones
- Extended-reality hardware manufacturing

### 15. Research, Education & R&D Services
- University research laboratories
- National and government research facilities
- Contract R&D and prototype development firms
- Testing, certification and standards bodies
- Technology transfer and incubator centers

### 16. Public Safety & Security
- Critical-infrastructure protection services
- Physical-security system integration
- Cybersecurity consulting and managed services
- Emergency-response technology providers
- Surveillance and situational-awareness platforms

---

## Implementation Notes

### Database Schema
- `industry_domains` table with 16 main categories
- `industry_subdomains` table with ~80 specialized areas
- Hierarchical relationship: subdomains belong to domains
- User interests can target either domain or subdomain level

### User Experience
- Users can express interest at domain level (includes all subdomains)
- Option to drill down to specific subdomain preferences
- Recommendation engine considers both levels
- Content delivery organized by this structure

### Content Strategy
Each industry domain should include:
- Sector overview and economic impact
- Key technologies and skill requirements
- Growth trends and career opportunities
- Connection to technology domains
- Real-world application examples 