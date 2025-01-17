import React from 'react';
import { Code2, Smartphone, Brain, Bot, Wifi, Terminal, Shield, Palette, Users } from 'lucide-react';
import { Domain } from '../types';

const domains: Domain[] = [
  {
    name: 'Web Development',
    description: 'Building modern web applications using cutting-edge technologies.',
    icon: 'Code2',
    lead: {
      name: 'Supriya Kumari',
      role: 'Lead'
    },
    colead: {
      name: 'Vikash Kumar Ranjan',
      role: 'Co-Lead'
    }
  },
  {
    name: 'App Development',
    description: 'Creating innovative mobile applications for various platforms.',
    icon: 'Smartphone',
    lead: {
      name: 'Abhishek Kumar Singh',
      role: 'Lead'
    },
    colead: {
      name: 'Ankit Upadhyay',
      role: 'Co-Lead'
    }
  },
  {
    name: 'AI & ML',
    description: 'Exploring artificial intelligence and machine learning technologies.',
    icon: 'Brain'
  },
  {
    name: 'Robotics & IoT',
    description: 'Building smart devices and robotic systems.',
    icon: 'Bot',
    lead: {
      name: 'Abhay Kumar',
      role: 'Lead'
    },
    colead: {
      name: 'Anjali Chauhan',
      role: 'Co-Lead'
    }
  },
  {
    name: 'Cybersecurity',
    description: 'Protecting digital assets and systems from cyber threats.',
    icon: 'Shield',
    lead: {
      name: 'Abhishek Kumar Jha',
      role: 'Lead'
    },
      colead: {
      name: 'Saurabh Kumar',
      role: 'Co-Lead'
    }
  },
  {
    name: 'Competitive Programming',
    description: 'Enhancing problem-solving and coding skills.',
    icon: 'Terminal',
    lead: {
      name: 'Devika Kumari',
      role: 'Lead'
    },
    colead: {
      name: 'Rakhee Kumari',
      role: 'Co-Lead'
    }
  },
  {
    name: 'Creativity',
    description: 'Fostering creative thinking and innovative solutions.',
    icon: 'Palette',
    lead: {
      name: 'Abhishek Kumar',
      role: 'Lead'
    },
    colead: {
      name: 'Braj Kumar',
      role: 'Co-Lead'
    }
  },
  {
    name: 'Outreach',
    description: 'Connecting with the community and spreading knowledge.',
    icon: 'Users',
    lead: {
      name: 'Abhiraj',
      role: 'Lead'
    },
    colead: {
      name: 'Surichi Kumar',
      role: 'Co-Lead'
    }
  }
];

const DomainSlider = () => {
  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ElementType } = {
      Code2, Smartphone, Brain, Bot, Wifi, Terminal, Shield, Palette, Users
    };
    const Icon = icons[iconName];
    return Icon ? <Icon className="w-8 h-8 mb-4" /> : null;
  };

  return (
    <div className="py-12 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Our Domains</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {domains.map((domain, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col items-center text-center">
                {getIcon(domain.icon)}
                <h3 className="text-xl font-semibold mb-2">{domain.name}</h3>
                <p className="text-gray-600 mb-4">{domain.description}</p>
                {domain.lead && (
                  <p className="text-sm text-gray-500">Lead: {domain.lead.name}</p>
                )}
                {domain.colead && (
                  <p className="text-sm text-gray-500">Co-Lead: {domain.colead.name}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DomainSlider;