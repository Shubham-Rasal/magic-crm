import { faker } from '@faker-js/faker';

export interface ICRMRow {
    [key: string]: string | string[] | number | Date;  // Allow string indexing
    id: string;
    fullName: string;
    email: string;
    linkedinUrl: string;
    companyName: string;
    jobTitle: string;
    currentCompany: string;
    workExperience: number;
    location: string;
    education: string;
    skills: string[];
    certifications: string[];
    companyWebsite: string;
    companyIndustry: string;
    companySize: string;
    companyHQLocation: string;
    fundingStage: string;
    recentNews: string;
    twitterHandle: string;
    githubProfile: string;
    personalWebsite: string;
    blogPosts: string[];
    recentLinkedInActivity: string;
    profilePictureUrl: string;
    contactAvailability: string;
    publicPhoneNumber: string;
    timeZone: string;
    bestTimeToContact: string;
    languagesSpoken: string[];
    leadScore: number;
    buyerIntentSignals: string;
    relevantProductFit: string;
    pastEngagements: string;
    notes: string;
    lastContacted: Date;
    followUpDate: Date;
    engagementStatus: string;
    crmOwner: string;
}

const fundingStages = ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C', 'IPO'];
const engagementStatuses = ['New Lead', 'In Progress', 'Qualified', 'Nurturing', 'Closed Won', 'Closed Lost'];
const industries = ['Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce', 'Manufacturing'];
const companySizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];

function generateDummyContact(): ICRMRow {
    return {
        id: faker.string.uuid(),
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        linkedinUrl: `linkedin.com/in/${faker.internet.username()}`,
        companyName: faker.company.name(),
        jobTitle: faker.person.jobTitle(),
        currentCompany: faker.company.name(),
        workExperience: faker.number.int({ min: 1, max: 25 }),
        location: faker.location.city() + ', ' + faker.location.country(),
        education: faker.helpers.arrayElement(['BS', 'MS', 'PhD', 'MBA']) + ' from ' + faker.company.name(),
        skills: faker.helpers.arrayElements(['JavaScript', 'Python', 'React', 'AWS', 'Product Management', 'Sales'], { min: 2, max: 5 }),
        certifications: faker.helpers.arrayElements(['AWS Certified', 'PMP', 'Scrum Master', 'Google Analytics'], { min: 0, max: 3 }),
        companyWebsite: faker.internet.url(),
        companyIndustry: faker.helpers.arrayElement(industries),
        companySize: faker.helpers.arrayElement(companySizes),
        companyHQLocation: faker.location.city() + ', ' + faker.location.country(),
        fundingStage: faker.helpers.arrayElement(fundingStages),
        recentNews: faker.lorem.sentence(),
        twitterHandle: '@' + faker.internet.username(),
        githubProfile: 'github.com/' + faker.internet.username(),
        personalWebsite: faker.internet.url(),
        blogPosts: Array(faker.number.int({ min: 0, max: 3 })).fill(null).map(() => faker.lorem.sentence()),
        recentLinkedInActivity: faker.lorem.sentence(),
        profilePictureUrl: faker.image.avatar(),
        contactAvailability: faker.helpers.arrayElement(['High', 'Medium', 'Low']),
        publicPhoneNumber: faker.phone.number(),
        timeZone: faker.location.timeZone(),
        bestTimeToContact: faker.helpers.arrayElement(['Morning', 'Afternoon', 'Evening']),
        languagesSpoken: faker.helpers.arrayElements(['English', 'Spanish', 'French', 'German', 'Chinese'], { min: 1, max: 3 }),
        leadScore: faker.number.int({ min: 1, max: 100 }),
        buyerIntentSignals: faker.helpers.arrayElement(['High', 'Medium', 'Low']),
        relevantProductFit: faker.helpers.arrayElement(['High', 'Medium', 'Low']),
        pastEngagements: faker.lorem.sentence(),
        notes: faker.lorem.paragraph(),
        lastContacted: faker.date.recent(),
        followUpDate: faker.date.future(),
        engagementStatus: faker.helpers.arrayElement(engagementStatuses),
        crmOwner: faker.person.fullName()
    };
}

export const dummyContacts: ICRMRow[] = Array(1).fill(null).map(() => generateDummyContact());
