import React from 'react';
import { Instagram, Linkedin, Mail } from 'lucide-react';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import Abhay from './Abhay.png';
import Prakhar from './prakhar.jpg';
import Ankita from './Ankita.jpg';
import Anjali from './Anjali.jpg';
import Braj from './Braj.jpg';
import Devika from './devika.jpg';
import Rakhee from './Rakhee.jpg';
import Saurabh from './Saurabh.jpg';
import blank from './blank.jpg';
import Abhishek from './Abhishek.jpg';
import AbhishekK from './AbhishekBhaiya.jpg';
import Abhiraj from './Abhiraj.jpg';
import AbhishekKumarJha from './33 - Abhisekh kumar jha..jpg';
import AnkitUpadhyay from './Ankit.jpg';
import Niraj from './Niraj.png';
import Suruchi from './Suruchi.jpg';
import Mentor from './mentor.jpg';
import principal1 from './principal.jpg';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  linkedin?: string;
  github?: string;
  email?: string;
  instagram?: string;
}
const principal: TeamMember = {
  id: 1,
  name: 'Mr. Manish Kumar',
  role: 'Principal, SEC Sasaram',
  image: principal1,
};

const mentor: TeamMember = {
  id: 2,
  name: 'Mr. Om Prakash',
  role: 'SPOC, GenX',
  image: Mentor,
};

const founder: TeamMember = {
  id: 3,
  name: 'Niraj Kumar',
  role: 'Founder, GenX',
  image: Niraj,
  instagram: 'https://www.instagram.com/avinash.vats_?igsh=MW4yZGpyZzFnYjBwag%3D%3D',
  linkedin: 'https://www.linkedin.com/in/niraj-vats/'
};

const leaders: TeamMember[] = [
  {
    id: 4,
    name: 'Abhay Kumar',
    role: 'Leader',
    image: Abhay,
    instagram: 'https://www.instagram.com/abhay_kr.07',
    linkedin: 'https://linkedin.com/in/abhay-kumar-81b2a8288/'
  },
  {
    id: 5,
    name: 'Abhiraj Kumar',
    role: 'Co-Leader',
    image: Abhiraj,
    instagram: 'https://instagram.com/abhiraj23',
    linkedin: 'https://linkedin.com/in/abhiraj23'
  }
];

const domainLeads: TeamMember[] = [
  {
    id: 6,
    name: 'Abhay Kumar',
    role: 'Robotics & IoT Lead',
    image: Abhay,
    instagram: 'https://www.instagram.com/abhay_kr.0705/',
    linkedin: 'https://www.linkedin.com/in/abhay-kumar-81b2a8288/'
  },
  {
    id: 7,
    name: 'Devika Kumari',
    role: 'Competitive Programming Lead',
    image: Devika,
    instagram: 'https://www.instagram.com/devikka_kummari/',
    linkedin: 'https://www.linkedin.com/in/devika-kumari-1bb2a22a6?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'
  },
  {
    id: 8,
    name: 'Abhishek Kumar',
    role: 'Creativity Lead',
    image: AbhishekK,
    instagram: 'https://www.instagram.com/_abhii__shek_?igsh=ZWhjMGxxZ3A0NmJ4',
    linkedin: 'https://www.linkedin.com/in/abhishek-kumar-4ba2801a7?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'
  },
  {
    id: 9,
    name: 'Abhiraj Kumar',
    role: 'Outreach Lead',
    image: Abhiraj,
    instagram: 'https://www.instagram.com/instabhiraj/profilecard/?igsh=aHB6dGthYzN5ZXRv',
    linkedin: 'https://www.linkedin.com/in/abhiraj23'
  },
  {
    id: 10,
    name: 'Prakhar Prasad',
    role: 'Web Development Lead',
    image: Prakhar,
    instagram: 'https://www.instagram.com/prakharprasad4?igsh=MTgyYjNuMHgwdTJxcA==',
    linkedin: 'https://www.linkedin.com/in/prakhar-prasad-0887b5343?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'
  },
  {
    id: 11,
    name: 'Abhishek Singh',
    role: 'App Development Lead',
    image: Abhishek,
    instagram: 'https://instagram.com/abhis..........0hek',
    linkedin: 'https://www.linkedin.com/in/abhisheksinghexpert'
  },
  {
    id: 12,
    name: 'Abhishek Kumar Jha',
    role: 'Cybersecurity Lead',
    image: AbhishekKumarJha,
    instagram: 'https://www.instagram.com/abhisekhkumar__?igsh=ODJmOWx6MXV3cTc4',
    linkedin: 'https://www.linkedin.com/in/abhisekh-kumar-jha-816407329?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'
  },
  {
    id: 13,
    name: '..........',
    role: 'AI ML Lead',
    image: blank,
    instagram: 'https://instagram.com/supri.....ya',
    linkedin: 'https://linkedin.com/in/supr.....iya'
  },
];

const domainCoLeads: TeamMember[] = [
  
  {
    id: 14,
    name: 'Ankit Upadhyay',
    role: 'App Development Co-Lead',
    image: AnkitUpadhyay,
    instagram: 'https://instagram.com/',
    linkedin: 'https://www.linkedin.com/in/ankit-upadhyay-083058287?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'
  },
  {
    id: 15,
    name: 'Suruchi Kumari',
    role: 'Outreach Co-Lead',
    image: Suruchi,
    instagram: 'https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=tf01d2uig_contact_invite&utm_medium=copy_link&utm_content=tf01d2u',
    linkedin: 'https://www.linkedin.com/in/suruchi2023'
  },
  {
    id: 16,
    name: 'Anjali Chauhan',
    role: 'Robotics & IoT Co-Lead',
    image: Anjali,
    instagram: 'https://instagram.com/a......0njali',
    linkedin: 'https://www.linkedin.com/in/anjali-c-637619331?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'
  },
  {
    id: 17,
    name: 'Rakhee Kumari',
    role: 'Competitive Programming Co-Lead',
    image: Rakhee,
    instagram: 'https://instagram.com/rakhee..0.0.0',
    linkedin: 'https://www.linkedin.com/in/rakhee-768943281?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'
  },
  {
    id: 18,
    name: 'Braj Kumar',
    role: 'Creativity Co-Lead',
    image: Braj,
    instagram: 'https://www.instagram.com/braj.here',
    linkedin: 'https://www.linkedin.com/in/abbraj'
  },
  {
    id: 19,
    name: 'Saurabh Kumar',
    role: 'Cybersecurity Co-Lead',
    image: Saurabh,
    instagram: 'https://www.instagram.com/_hmm.saurabh?igsh=aWxhejhubnBpb2h1',
    linkedin: 'https://www.linkedin.com/in/saurabh-kumar-b85597322?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'
  },
  
  {
    id: 20,
    name: 'Ankita kumari',
    role: 'Web Development Co-Lead',
    image: Ankita,
    instagram: 'https://instagram.com/....',
    linkedin: 'https://www.linkedin.com/in/ankitakk'
  },
  {
    id: 21,
    name: '..........',
    role: 'AI ML Co-Lead',
    image: blank,
    instagram: 'https://instagram.com/supri......0ya',
    linkedin: 'https://linkedin.com/in/supri.0...0ya'
  }
];

const TeamMemberCard: React.FC<{ member: TeamMember }> = ({ member }) => (
  <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl h-full flex flex-col">
    <div className="aspect-square overflow-hidden flex-shrink-0">
      <img
        src={member.image}
        alt={member.name}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
    <div className="p-4 text-center bg-white flex-grow flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors duration-300">
          {member.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 font-medium">{member.role}</p>
      </div>
      <div className="flex justify-center space-x-7 pt-2 border-t border-gray-100">
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transform hover:scale-110 transition-transform duration-200"
          >
            <Linkedin className="h-5 w-5 text-gray-600 hover:text-blue-600" />
          </a>
        )}
        {member.github && (
          <a
            href={member.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transform hover:scale-110 transition-transform duration-200"
          >
            <FaGithub className="h-5 w-5 text-gray-600 hover:text-gray-800" />
          </a>
        )}
        {member.instagram && (
          <a
            href={member.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="transform hover:scale-110 transition-transform duration-200"
          >
            <Instagram className="h-5 w-5 text-gray-600 hover:text-pink-600" />
          </a>
        )}
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="transform hover:scale-110 transition-transform duration-200"
          >
            <Mail className="h-5 w-5 text-gray-600 hover:text-red-600" />
          </a>
        )}
      </div>
    </div>
  </div>
);

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <h2 className="text-3xl font-bold text-center mb-12">
    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
      {title}
    </span>
  </h2>
);

const Team = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 py-20">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-fadeIn">
          <h1 className="text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Meet Our Team
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We are a passionate team of developers dedicated to creating innovative solutions and fostering a community of tech enthusiasts.
          </p>
        </div>

        {/* Mentor & Founder Section */}
        <div className="mb-24">
          <SectionTitle title="Club Mentorship" />
          <div className="flex flex-col sm:flex-row justify-center gap-6 lg:gap-8 max-w-7xl mx-auto">
            {principal && (
              <div className="w-full sm:w-1/3 lg:w-1/4 animate-fadeIn">
                <TeamMemberCard member={principal} />
              </div>
            )}
            {mentor && (
              <div className="w-full sm:w-1/3 lg:w-1/4 animate-fadeIn">
                <TeamMemberCard member={mentor} />
              </div>
            )}
            {founder && (
              <div className="w-full sm:w-1/3 lg:w-1/4 animate-fadeIn">
                <TeamMemberCard member={founder} />
              </div>
            )}
          </div>
        </div>

        {/* Leaders Section */}
        <div className="mb-24">
          <SectionTitle title="Club Leadership" />
          <div className="flex flex-col sm:flex-row justify-center gap-6 lg:gap-8 max-w-7xl mx-auto">
            {leaders.map((leader, index) => (
              <div key={leader.id} className="w-full sm:w-1/3 lg:w-1/4 animate-fadeIn">
                <TeamMemberCard member={leader} />
              </div>
            ))}
          </div>
        </div>

        {/* Domain Leads Section */}
        <div className="mb-24">
          <SectionTitle title="Domain Leads" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {domainLeads.map((lead) => (
              <div key={lead.id} className="col-span-1 h-full animate-fadeIn">
                <div className="h-full">
                  <TeamMemberCard member={lead} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Domain Co-Leads Section */}
        <div className="mb-24">
          <SectionTitle title="Domain Co-Leads" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {domainCoLeads.map((coLead) => (
              <div key={coLead.id} className="col-span-1 h-full animate-fadeIn">
                <div className="h-full">
                  <TeamMemberCard member={coLead} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Join Us Section */}
        <div className="mt-20 text-center animate-fadeIn">
          <h2 className="text-3xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Join Our Community
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            We're always looking for passionate individuals to join our team. If you're interested in contributing to our mission, reach out to us!
          </p>
          <a
            href="mailto:genx.gdc@gmail.com"
            className="inline-flex items-center px-8 py-3 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
          >
            <Mail className="mr-2" />
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
};

export default Team;