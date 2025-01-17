import React from 'react';
import { Instagram, Linkedin } from 'lucide-react';
import Abhay from './Abhay.png';
import Prakhar from './prakhar.jpg';

import Ankit from './Ankit.jpg';
import Anjali from './Anjali.jpg';
import Braj from './Braj.jpg';
import Devika from './devika.jpg';
import Rakhee from './Rakhee.jpg';
import Saurabh from './Saurabh.jpg';
import blank from './blank.jpg';
import VikashR from './Vikash.jpg';
import Abhishek from './Abhishek.jpg';
import AbhishekK from './AbhishekBhaiya.jpg';
import AbhishekJ from './Abhishek_J.jpg';
import Abhiraj from './Abhiraj.jpg';
import AbhishekKumarJha from './33 - Abhisekh kumar jha..jpg';
import AnkitUpadhyay from './Ankit.jpg';
import Niraj from './Niraj.png';
import Suruchi from './Suruchi.jpg';
import Mentor from './mentor.jpg';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  instagram?: string;
  linkedin?: string;
}

const mentor: TeamMember = {
  name: 'Mr. Om Prakash',
  role: 'HOD Of CSE Department',
  image: Mentor,
  
};

const founder: TeamMember = {
  name: 'Niraj Kumar',
  role: '',
  image: Niraj,
  instagram: 'https://instagram.com/nirajkumar',
  linkedin: 'https://linkedin.com/in/nirajkumar'
};

const leaders: TeamMember[] = [
  {
    name: 'Leader Name',
    role: 'Leader',
    image: '/leader.png',
    instagram: 'https://instagram.com/leader',
    linkedin: 'https://linkedin.com/in/leader'
  },
  {
    name: 'Co-Leader Name',
    role: 'Co-Leader',
    image: '/coleader.png',
    instagram: 'https://instagram.com/coleader',
    linkedin: 'https://linkedin.com/in/coleader'
  }
];

const domainLeads: TeamMember[] = [
 
  {
    name: 'Abhay Kumar',
    role: 'Robotics & IoT Lead',
    image: Abhay,
    instagram: 'https://instagram.com/abhay',
    linkedin: 'https://linkedin.com/in/abhay'
  },
  {
    name: 'Devika Kumari',
    role: 'Competitive Programming Lead',
    image: Devika,
    instagram: 'https://instagram.com/devika',
    linkedin: 'https://linkedin.com/in/devika'
  },
  {
    name: 'Abhishek Kumar',
    role: 'Creativity Lead',
    image: AbhishekK,
    instagram: 'https://instagram.com/abhishek.k',
    linkedin: 'https://linkedin.com/in/abhishek.k'
  },
  {
    name: 'Abhiraj Kumar',
    role: 'Outreach Lead',
    image: Abhiraj,
    instagram: 'https://instagram.com/abhiraj',
    linkedin: 'https://linkedin.com/in/abhiraj'
  },
  {
    name: '..........',
    role: 'Web Development Lead',
    image: blank,
    instagram: 'https://instagram.com/supriya',
    linkedin: 'https://linkedin.com/in/supriya'
  },
  {
    name: 'Abhishek Singh',
    role: 'App Development Lead',
    image: Abhishek,
    instagram: 'https://instagram.com/abhishek',
    linkedin: 'https://linkedin.com/in/abhishek'
  },
  {
    name: 'Abhishek Jha',
    role: 'Cybersecurity Lead',
    image: AbhishekKumarJha,
    instagram: 'https://instagram.com/abhishek.j',
    linkedin: 'https://linkedin.com/in/abhishek.j'
  },
  {
    name: '..........',
    role: 'AI ML Lead',
    image: blank,
    instagram: 'https://instagram.com/supriya',
    linkedin: 'https://linkedin.com/in/supriya'
  },
  
];

const domainCoLeads: TeamMember[] = [

  {
    name: 'Prakhar Prasad',
    role: 'Web Development Co-Lead',
    image: Prakhar,
    instagram: 'https://instagram.com/prakhar',
    linkedin: 'https://linkedin.com/in/prakhar'
  },
  {
    name: 'Ankit Upadhyay',
    role: 'App Development Co-Lead',
    image: AnkitUpadhyay,
    instagram: 'https://instagram.com/ankit',
    linkedin: 'https://linkedin.com/in/ankit'
  },
  {
    name: 'Anjali Chauhan',
    role: 'Robotics & IoT Co-Lead',
    image: Anjali,
    instagram: 'https://instagram.com/anjali',
    linkedin: 'https://linkedin.com/in/anjali'
  },
  {
    name: 'Rakhee Kumari',
    role: 'Competitive Programming Co-Lead',
    image: Rakhee,
    instagram: 'https://instagram.com/rakhee',
    linkedin: 'https://linkedin.com/in/rakhee'
  },
  {
    name: 'Braj Kumar',
    role: 'Creativity Co-Lead',
    image: Braj,
    instagram: 'https://instagram.com/braj',
    linkedin: 'https://linkedin.com/in/braj'
  },
  {
    name: 'Saurabh Kumar',
    role: 'Cybersecurity Co-Lead',
    image: Saurabh,
    instagram: 'https://instagram.com/saurabh',
    linkedin: 'https://linkedin.com/in/saurabh'
  },
  {
    name: 'Suruchi Sharma',
    role: 'Outreach Co-Lead',
    image: Suruchi,
    instagram: 'https://instagram.com/suruchi',
    linkedin: 'https://linkedin.com/in/suruchi'
  },
  {
    name: '..........',
    role: 'AI ML Co-Lead',
    image: blank,
    instagram: 'https://instagram.com/supriya',
    linkedin: 'https://linkedin.com/in/supriya'
  }
];

const TeamMemberCard = ({ member }: { member: TeamMember }) => (
  <div className="bg-white rounded-lg shadow-md p-6 text-center transform transition-transform hover:scale-105">
    <img
      src={member.image}
      alt={member.name}
      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
    />
    <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
    <p className="text-gray-600 mb-4">{member.role}</p>
    <div className="flex justify-center space-x-4">
      {member.instagram && (
        <a
          href={member.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-600 hover:text-pink-700"
        >
          <Instagram className="h-5 w-5" />
        </a>
      )}
      {member.linkedin && (
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700"
        >
          <Linkedin className="h-5 w-5" />
        </a>
      )}
    </div>
  </div>
);

const Team = () => {
  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <section className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">Our Team</h1>
        
        {/* Mentor and Founder Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="w-full">
              <h2 className="text-2xl font-bold text-center mb-4">Mentor</h2>
              <TeamMemberCard member={mentor} />
            </div>
            <div className="w-full">
              <h2 className="text-2xl font-bold text-center mb-4">Founder</h2>
              <TeamMemberCard member={founder} />
            </div>
          </div>
        </div>

        {/* Leaders Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {leaders.map((leader, index) => (
              <TeamMemberCard key={index} member={leader} />
            ))}
          </div>
        </div>

        {/* Domain Leads Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Domain Leads</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {domainLeads.map((lead, index) => (
              <TeamMemberCard key={index} member={lead} />
            ))}
          </div>
        </div>

        {/* Domain Co-Leads Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Domain Co-Leads</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {domainCoLeads.map((colead, index) => (
              <TeamMemberCard key={index} member={colead} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;