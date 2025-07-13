import React, { useState } from 'react';
import { Copy, Check, Lightbulb, Target, MessageSquare, Settings, TrendingUp, BarChart3, Users } from 'lucide-react';

const SmartPromptWriter = () => {
  const [businessProfile, setBusinessProfile] = useState({
    businessName: '',
    industry: '',
    targetAudience: '',
    mainProduct: '',
    keyChallenge: '',
    businessSize: ''
  });
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedUseCase, setSelectedUseCase] = useState('');
  const [showUseCases, setShowUseCases] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [showBestPractices, setShowBestPractices] = useState(false);

  const categories = [
    { id: 'marketing', name: 'Marketing Copy', icon: Target, color: 'bg-blue-500' },
    { id: 'customer-service', name: 'Customer Service', icon: MessageSquare, color: 'bg-green-500' },
    { id: 'process', name: 'Process Optimization', icon: Settings, color: 'bg-purple-500' },
    { id: 'sales', name: 'Sales Outreach', icon: TrendingUp, color: 'bg-orange-500' },
    { id: 'social', name: 'Social Media', icon: Users, color: 'bg-pink-500' },
    { id: 'planning', name: 'Business Planning', icon: BarChart3, color: 'bg-indigo-500' }
  ];

  const promptTemplates = {
    marketing: {
      useCases: [
        {
          name: "Website Homepage Copy",
          template: `Create compelling homepage copy for ${businessProfile.businessName}, a ${businessProfile.industry} business targeting ${businessProfile.targetAudience}. 

Key product/service: ${businessProfile.mainProduct}
Main challenge to address: ${businessProfile.keyChallenge}
Business size: ${businessProfile.businessSize}

Please create homepage copy that:
- Captures attention with a strong headline
- Clearly explains what we do and who we serve
- Highlights our unique value proposition
- Includes social proof elements
- Has a clear call-to-action above the fold
- Addresses common objections

Format: Provide headline, subheadline, main sections, and CTA button text.`,
          example: "Great for creating your main website homepage that converts visitors into customers"
        },
        {
          name: "Email Marketing Campaign",
          template: `Create an email marketing campaign for ${businessProfile.businessName}, a ${businessProfile.industry} business targeting ${businessProfile.targetAudience}.

Key product/service: ${businessProfile.mainProduct}
Main challenge to address: ${businessProfile.keyChallenge}
Business size: ${businessProfile.businessSize}

Please create a 3-email sequence that:
- Builds trust and provides value
- Addresses our target audience's pain points
- Gradually introduces our solution
- Includes compelling subject lines
- Has clear calls-to-action in each email

Format: Provide subject lines, email content, and timing recommendations.`,
          example: "Perfect for nurturing leads and converting them into paying customers"
        },
        {
          name: "Social Media Ads",
          template: `Create social media ad copy for ${businessProfile.businessName}, a ${businessProfile.industry} business targeting ${businessProfile.targetAudience}.

Key product/service: ${businessProfile.mainProduct}
Main challenge to address: ${businessProfile.keyChallenge}
Business size: ${businessProfile.businessSize}

Please create ad variations for:
- Facebook/Instagram ads (different lengths)
- LinkedIn ads (professional tone)
- Ad headlines and descriptions
- Multiple hooks to test
- Clear value propositions
- Strong calls-to-action

Format: Provide multiple ad variations with explanations of target audience fit.`,
          example: "Ideal for creating high-converting social media advertisements"
        }
      ],
      example: "Perfect for creating website copy, email campaigns, or ad content that converts"
    },
    'customer-service': {
      useCases: [
        {
          name: "Customer Complaint Resolution",
          template: `Help me create customer complaint resolution templates for ${businessProfile.businessName}, a ${businessProfile.industry} business serving ${businessProfile.targetAudience}.

Business context:
- Main product/service: ${businessProfile.mainProduct}
- Key challenge: ${businessProfile.keyChallenge}
- Business size: ${businessProfile.businessSize}

Please create templates for:
- Acknowledging the complaint professionally
- Investigating and gathering information
- Providing solutions and alternatives
- Following up to ensure satisfaction
- Preventing similar issues in the future

Include specific phrases that show empathy while maintaining professionalism. Provide templates for both email and phone conversations.`,
          example: "Essential for handling customer complaints professionally and maintaining relationships"
        },
        {
          name: "FAQ and Support Responses",
          template: `Create comprehensive FAQ responses for ${businessProfile.businessName}, a ${businessProfile.industry} business serving ${businessProfile.targetAudience}.

Business context:
- Main product/service: ${businessProfile.mainProduct}
- Key challenge: ${businessProfile.keyChallenge}
- Business size: ${businessProfile.businessSize}

Please help me create:
- Answers to the top 10 most common customer questions
- Clear, helpful responses that reduce back-and-forth
- Proactive information that prevents issues
- Escalation procedures for complex questions
- Templates for different communication channels (email, chat, phone)

Focus on being helpful while reducing support workload.`,
          example: "Perfect for creating self-service resources and consistent support responses"
        },
        {
          name: "Customer Onboarding Sequence",
          template: `Design a customer onboarding sequence for ${businessProfile.businessName}, a ${businessProfile.industry} business serving ${businessProfile.targetAudience}.

Business context:
- Main product/service: ${businessProfile.mainProduct}
- Key challenge: ${businessProfile.keyChallenge}
- Business size: ${businessProfile.businessSize}

Please create an onboarding sequence that:
- Welcomes new customers warmly
- Sets clear expectations
- Provides step-by-step guidance
- Anticipates and addresses common questions
- Includes check-in points and success milestones
- Encourages engagement and feedback

Format as a series of communications (emails, calls, materials) with timing recommendations.`,
          example: "Great for ensuring new customers have a smooth start and become long-term clients"
        }
      ],
      example: "Great for building response templates, training materials, and customer communication strategies"
    },
    process: {
      useCases: [
        {
          name: "Standard Operating Procedures (SOPs)",
          template: `Create standard operating procedures for ${businessProfile.businessName}, a ${businessProfile.industry} business.

Current situation:
- Business type: ${businessProfile.industry}
- Target market: ${businessProfile.targetAudience}
- Main offering: ${businessProfile.mainProduct}
- Key challenge: ${businessProfile.keyChallenge}
- Business size: ${businessProfile.businessSize}

Please help me create SOPs for:
- Core business processes (specify which ones)
- Step-by-step procedures that anyone can follow
- Quality checkpoints and standards
- Common troubleshooting scenarios
- Training materials for new team members

Format as clear, actionable procedures with checklists and visual flow charts where helpful.`,
          example: "Essential for creating consistent processes and training new team members"
        },
        {
          name: "Workflow Automation Analysis",
          template: `Analyze automation opportunities for ${businessProfile.businessName}, a ${businessProfile.industry} business.

Current situation:
- Business type: ${businessProfile.industry}
- Target market: ${businessProfile.targetAudience}
- Main offering: ${businessProfile.mainProduct}
- Key challenge: ${businessProfile.keyChallenge}
- Business size: ${businessProfile.businessSize}

Please help me:
- Identify repetitive tasks that can be automated
- Recommend specific tools and software solutions
- Create implementation roadmaps with priorities
- Calculate potential time and cost savings
- Suggest workflows that connect different systems

Focus on practical, budget-friendly automation that provides immediate ROI.`,
          example: "Perfect for identifying time-saving automation opportunities and tool recommendations"
        },
        {
          name: "Quality Control Systems",
          template: `Develop quality control systems for ${businessProfile.businessName}, a ${businessProfile.industry} business.

Current situation:
- Business type: ${businessProfile.industry}
- Target market: ${businessProfile.targetAudience}
- Main offering: ${businessProfile.mainProduct}
- Key challenge: ${businessProfile.keyChallenge}
- Business size: ${businessProfile.businessSize}

Please help me create:
- Quality standards and benchmarks
- Inspection checklists and procedures
- Customer satisfaction measurement systems
- Error prevention protocols
- Continuous improvement processes

Provide specific metrics to track and methods to maintain consistency across all operations.`,
          example: "Great for ensuring consistent quality and customer satisfaction"
        }
      ],
      example: "Ideal for streamlining operations, creating SOPs, and identifying automation opportunities"
    },
    sales: {
      useCases: [
        {
          name: "Cold Email Outreach",
          template: `Create cold email outreach templates for ${businessProfile.businessName}, a ${businessProfile.industry} business.

Business details:
- Target audience: ${businessProfile.targetAudience}
- Main product/service: ${businessProfile.mainProduct}
- Key challenge we solve: ${businessProfile.keyChallenge}
- Business size: ${businessProfile.businessSize}

Please create a cold email sequence that includes:
- Attention-grabbing subject lines
- Personalized opening lines
- Clear value proposition
- Social proof elements
- Compelling calls-to-action
- Follow-up email templates (3-4 emails)

Focus on building relationships rather than being pushy. Include personalization strategies and timing recommendations.`,
          example: "Perfect for reaching new prospects and building your sales pipeline"
        },
        {
          name: "Sales Call Scripts",
          template: `Develop sales call scripts for ${businessProfile.businessName}, a ${businessProfile.industry} business.

Business details:
- Target audience: ${businessProfile.targetAudience}
- Main product/service: ${businessProfile.mainProduct}
- Key challenge we solve: ${businessProfile.keyChallenge}
- Business size: ${businessProfile.businessSize}

Please create scripts for:
- Cold calling introduction
- Discovery questions to understand needs
- Presentation of our solution
- Handling common objections
- Closing techniques
- Follow-up call strategies

Include conversation flow guides and tips for building rapport over the phone.`,
          example: "Essential for phone-based sales and converting leads into customers"
        },
        {
          name: "Sales Funnel Optimization",
          template: `Optimize the sales funnel for ${businessProfile.businessName}, a ${businessProfile.industry} business.

Business details:
- Target audience: ${businessProfile.targetAudience}
- Main product/service: ${businessProfile.mainProduct}
- Key challenge we solve: ${businessProfile.keyChallenge}
- Business size: ${businessProfile.businessSize}

Please help me analyze and improve:
- Lead generation strategies
- Lead qualification processes
- Nurturing sequences for different prospect types
- Conversion optimization at each stage
- Sales metrics and KPIs to track
- Follow-up systems for lost opportunities

Provide specific recommendations for each stage of the funnel with implementation steps.`,
          example: "Great for improving conversion rates and maximizing revenue from existing traffic"
        }
      ],
      example: "Perfect for creating email sequences, cold outreach scripts, and sales funnel content"
    },
    social: {
      useCases: [
        {
          name: "Content Calendar Planning",
          template: `Create a monthly content calendar for ${businessProfile.businessName}, a ${businessProfile.industry} business targeting ${businessProfile.targetAudience}.

Business context:
- Main product/service: ${businessProfile.mainProduct}
- Key challenge we address: ${businessProfile.keyChallenge}
- Business size: ${businessProfile.businessSize}

Please create a 30-day content calendar that includes:
- Mix of educational, promotional, and engaging content
- Platform-specific content for [specify platforms]
- Trending topics relevant to our industry
- Behind-the-scenes content ideas
- User-generated content opportunities
- Seasonal or timely content hooks

Format as a calendar with post ideas, optimal posting times, and content types for each day.`,
          example: "Perfect for planning consistent, engaging social media content that builds your brand"
        },
        {
          name: "Social Media Post Templates",
          template: `Create social media post templates for ${businessProfile.businessName}, a ${businessProfile.industry} business targeting ${businessProfile.targetAudience}.

Business context:
- Main product/service: ${businessProfile.mainProduct}
- Key challenge we address: ${businessProfile.keyChallenge}
- Business size: ${businessProfile.businessSize}

Please create templates for:
- Educational posts that provide value
- Promotional posts that don't feel salesy
- Behind-the-scenes content
- Customer testimonial features
- Question posts that encourage engagement
- Trending topic responses

Include hooks, body text, and call-to-action examples for each template type.`,
          example: "Great for creating consistent, on-brand posts that engage your audience"
        },
        {
          name: "Social Media Advertising",
          template: `Develop social media advertising strategy for ${businessProfile.businessName}, a ${businessProfile.industry} business targeting ${businessProfile.targetAudience}.

Business context:
- Main product/service: ${businessProfile.mainProduct}
- Key challenge we address: ${businessProfile.keyChallenge}
- Business size: ${businessProfile.businessSize}

Please help me create:
- Targeted ad campaigns for different objectives (awareness, leads, sales)
- Audience targeting strategies
- Ad creative ideas and copy variations
- Landing page alignment recommendations
- Budget allocation suggestions
- Performance tracking metrics

Focus on cost-effective campaigns that generate measurable results.`,
          example: "Essential for running profitable social media ad campaigns that drive business results"
        }
      ],
      example: "Great for content calendars, post templates, and engagement strategies across platforms"
    },
    planning: {
      useCases: [
        {
          name: "90-Day Growth Plan",
          template: `Create a 90-day growth plan for ${businessProfile.businessName}, a ${businessProfile.industry} business.

Current business details:
- Target market: ${businessProfile.targetAudience}
- Main product/service: ${businessProfile.mainProduct}
- Key challenge: ${businessProfile.keyChallenge}
- Business size: ${businessProfile.businessSize}

Please help me develop a detailed 90-day plan that includes:
- Specific growth goals and targets
- Week-by-week action items
- Marketing and sales initiatives
- Operational improvements needed
- Key metrics to track progress
- Resource requirements and budget considerations

Focus on achievable, measurable goals with clear deadlines and accountability measures.`,
          example: "Perfect for creating focused, actionable growth plans with clear milestones"
        },
        {
          name: "Financial Planning & Budgeting",
          template: `Help me create a financial plan for ${businessProfile.businessName}, a ${businessProfile.industry} business.

Current business details:
- Target market: ${businessProfile.targetAudience}
- Main product/service: ${businessProfile.mainProduct}
- Key challenge: ${businessProfile.keyChallenge}
- Business size: ${businessProfile.businessSize}

Please help me develop:
- Monthly and quarterly budget forecasts
- Revenue projections and growth scenarios
- Cost analysis and expense optimization
- Cash flow management strategies
- Investment priorities and ROI calculations
- Financial KPIs to monitor business health

Provide practical templates and frameworks for ongoing financial management.`,
          example: "Essential for managing business finances and making data-driven investment decisions"
        },
        {
          name: "Market Analysis & Competitive Strategy",
          template: `Conduct market analysis for ${businessProfile.businessName}, a ${businessProfile.industry} business.

Current business details:
- Target market: ${businessProfile.targetAudience}
- Main product/service: ${businessProfile.mainProduct}
- Key challenge: ${businessProfile.keyChallenge}
- Business size: ${businessProfile.businessSize}

Please help me analyze:
- Target market size and growth potential
- Competitive landscape and positioning
- Market trends and opportunities
- Customer behavior and preferences
- Pricing strategies and value proposition
- Market entry or expansion strategies

Provide actionable insights and strategic recommendations based on the analysis.`,
          example: "Great for understanding your market position and identifying growth opportunities"
        }
      ],
      example: "Perfect for strategic planning, financial forecasting, and growth strategy development"
    }
  };

  const bestPractices = [
    {
      title: "Be Specific with Context",
      tip: "The more details you provide about your business, the better the AI can tailor its response to your needs."
    },
    {
      title: "Include Your Goals",
      tip: "Always specify what you want to achieve - whether it's increasing sales, improving efficiency, or building brand awareness."
    },
    {
      title: "Ask for Examples",
      tip: "Request specific examples, templates, or step-by-step instructions rather than general advice."
    },
    {
      title: "Specify Format Preferences",
      tip: "Tell the AI how you want the response formatted - bullet points, paragraphs, templates, etc."
    },
    {
      title: "Request Multiple Options",
      tip: "Ask for 2-3 different approaches or variations to give you more choices and inspiration."
    },
    {
      title: "Include Success Metrics",
      tip: "Ask how to measure success and what KPIs to track for your specific initiative."
    }
  ];

  const handleGeneratePrompt = (categoryId, useCaseIndex = null) => {
    if (!businessProfile.businessName || !businessProfile.industry) {
      alert('Please fill in at least your business name and industry before generating a prompt.');
      return;
    }
    
    setSelectedCategory(categoryId);
    
    if (useCaseIndex !== null) {
      const useCase = promptTemplates[categoryId].useCases[useCaseIndex];
      setGeneratedPrompt(useCase.template);
      setSelectedUseCase(useCase.name);
      setShowUseCases(false);
    } else {
      setShowUseCases(true);
      setGeneratedPrompt('');
      setSelectedUseCase('');
    }
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (field, value) => {
    setBusinessProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Smart Prompt Writer</h1>
          <p className="text-gray-600">Generate AI prompts tailored to your small business needs</p>
        </div>

        {/* Business Profile Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Business Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your business name"
                value={businessProfile.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Restaurant, Retail, Consulting"
                value={businessProfile.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Small business owners, Young professionals"
                value={businessProfile.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Product/Service</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Web design, Italian food, Business coaching"
                value={businessProfile.mainProduct}
                onChange={(e) => handleInputChange('mainProduct', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Key Challenge</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Getting more customers, Improving efficiency"
                value={businessProfile.keyChallenge}
                onChange={(e) => handleInputChange('keyChallenge', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Size</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={businessProfile.businessSize}
                onChange={(e) => handleInputChange('businessSize', e.target.value)}
              >
                <option value="">Select size</option>
                <option value="Solo entrepreneur">Solo entrepreneur</option>
                <option value="2-5 employees">2-5 employees</option>
                <option value="6-20 employees">6-20 employees</option>
                <option value="21-50 employees">21-50 employees</option>
              </select>
            </div>
          </div>
        </div>

        {/* Best Practices Toggle */}
        <div className="mb-6">
          <button
            onClick={() => setShowBestPractices(!showBestPractices)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            <Lightbulb className="w-5 h-5" />
            {showBestPractices ? 'Hide' : 'Show'} Best Practices for Writing Prompts
          </button>
        </div>

        {/* Best Practices Section */}
        {showBestPractices && (
          <div className="mb-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-800">Best Practices for Effective Prompts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bestPractices.map((practice, index) => (
                <div key={index} className="bg-white p-4 rounded-md border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">{practice.title}</h4>
                  <p className="text-sm text-gray-700">{practice.tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Choose Your Prompt Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleGeneratePrompt(category.id)}
                className="p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-md ${category.color} text-white group-hover:scale-110 transition-transform`}>
                    <category.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-gray-800">{category.name}</h3>
                </div>
                <p className="text-sm text-gray-600">{promptTemplates[category.id].example}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Use Cases Dropdown */}
        {showUseCases && selectedCategory && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Choose a specific use case for {categories.find(c => c.id === selectedCategory)?.name}:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {promptTemplates[selectedCategory].useCases.map((useCase, index) => (
                <button
                  key={index}
                  onClick={() => handleGeneratePrompt(selectedCategory, index)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left"
                >
                  <h3 className="font-semibold text-gray-800 mb-2">{useCase.name}</h3>
                  <p className="text-sm text-gray-600">{useCase.example}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Generated Prompt Section */}
        {generatedPrompt && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Your Generated Prompt: {selectedUseCase}
              </h2>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Prompt'}
              </button>
            </div>
            <div className="bg-gray-100 rounded-lg p-6 border-l-4 border-blue-500">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                {generatedPrompt}
              </pre>
            </div>
            <div className="mt-4 p-4 bg-green-50 rounded-md border border-green-200">
              <p className="text-sm text-green-800">
                <strong>How to use:</strong> Copy this prompt and paste it into your preferred AI tool (ChatGPT, Claude, etc.). 
                You can modify any part of it to better fit your specific needs.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  return <SmartPromptWriter />;
};

export default App;