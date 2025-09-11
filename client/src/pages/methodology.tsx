import { HeaderNavigation } from "@/components/header-navigation";
import Footer from "@/components/footer";
import { motion } from "framer-motion";

export default function Methodology() {
  return (
    <div className="min-h-screen overflow-x-hidden overflow-y-visible bg-white dark:bg-black flex flex-col">
      <HeaderNavigation />
      <div className="flex-grow relative overflow-visible">
        {/* Floating glass elements */}
        <div className="absolute top-20 right-20 w-40 h-60 bg-gradient-to-br from-gray-200/30 to-gray-300/20 dark:from-white/10 dark:to-white/5 rounded-3xl transform rotate-12 blur-sm"></div>
        <div className="absolute top-80 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-40 right-40 w-48 h-32 bg-gradient-to-br from-gray-200/25 to-gray-300/15 dark:from-white/8 dark:to-white/3 rounded-2xl transform -rotate-6 blur-sm"></div>
        
        <div className="relative z-10 overflow-visible">
          {/* Hero Section */}
          <div className="w-full px-6 lg:px-8 pt-32 pb-20">
            <div className="max-w-6xl mx-auto text-center">
              <motion.h1 
                className="text-5xl lg:text-6xl font-light text-gray-900 dark:text-white mb-8 leading-tight tracking-wide"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                THE METHODOLOGY
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 dark:text-white/70 max-w-2xl mx-auto leading-relaxed font-light"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                Our comprehensive approach to evaluating large language models on CFA Level III exam content, 
                combining rigorous dataset construction with advanced prompting strategies.
              </motion.p>
              
              <motion.div 
                className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-gray-200/50 dark:border-white/10 max-w-4xl mx-auto mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                <div className="text-gray-600 dark:text-white/70 leading-relaxed font-light text-sm">
                  [1] Pranam Shetty, Abhisek Upadhayaya, Parth Mitesh Shah, Srikanth Jagabathula, Shilpi Nayak, Anna Joo Fee, 
                  "Advanced Financial Reasoning at Scale: A Comprehensive Evaluation of Large Language Models on CFA Level III," 
                  <em>arXiv preprint arXiv:2507.02954</em>, 2025. [Online]. 
                  <br />
                  <a 
                    href="https://arxiv.org/abs/2507.02954" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                  >
                    https://arxiv.org/abs/2507.02954
                  </a>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full px-6 lg:px-8 pb-20">
            <div className="max-w-7xl mx-auto space-y-32">
              
              {/* Dataset Construction Section */}
              <motion.section 
                className="relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="mb-16">
                  <motion.div 
                    className="flex items-center mb-8"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <span className="text-6xl font-light text-gray-300 dark:text-white/20 mr-6">01</span>
                    <h2 className="text-2xl lg:text-3xl font-light text-gray-900 dark:text-white tracking-wide">
                      DATASET CONSTRUCTION
                      <br />
                      <span className="font-normal text-gray-600 dark:text-white/70">AND VALIDATION</span>
                    </h2>
                  </motion.div>
                  <motion.p 
                    className="text-lg text-gray-600 dark:text-white/60 max-w-4xl leading-relaxed font-light"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    Our dataset utilizes high-quality custom curated exam materials from AnalystPrep, a leading CFA preparation provider 
                    serving over 100,000 candidates worldwide.
                  </motion.p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-16">
                  <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-gray-200/50 dark:border-white/10">
                    <div className="flex items-center mb-6">
                      <h3 className="text-2xl font-light text-gray-900 dark:text-white">Multiple-Choice Questions</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center text-gray-600 dark:text-white/70">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-4 shrink-0"></div>
                        <span>60 questions total</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-white/70">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-4 shrink-0"></div>
                        <span>10 vignettes with 6 questions each</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-white/70">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-4 shrink-0"></div>
                        <span>Covers all major Level III curriculum areas</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-white/70">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-4 shrink-0"></div>
                        <span>Verified and tested by official CFA graders post-evaluation</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-gray-200/50 dark:border-white/10">
                    <div className="flex items-center mb-6">
                      <h3 className="text-2xl font-light text-gray-900 dark:text-white">Essay Questions</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center text-gray-600 dark:text-white/70">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-4 shrink-0"></div>
                        <span>11 unique vignettes</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-white/70">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-4 shrink-0"></div>
                        <span>43 total questions (149 total points)</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-white/70">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-4 shrink-0"></div>
                        <span>2-5 open-ended questions per vignette</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-white/70">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-4 shrink-0"></div>
                        <span>Content integrity verified by official CFA graders</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-gray-200/50 dark:border-white/10">
                  <h4 className="text-2xl font-light text-gray-900 dark:text-white mb-8 flex items-center">
                    Coverage Areas
                  </h4>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center text-gray-600 dark:text-white/70">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 shrink-0"></div>
                        <span className="font-light">Private Wealth Management</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-white/70">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 shrink-0"></div>
                        <span className="font-light">Portfolio Management</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-white/70">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 shrink-0"></div>
                        <span className="font-light">Private Markets</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center text-gray-600 dark:text-white/70">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 shrink-0"></div>
                        <span className="font-light">Asset Management</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-white/70">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 shrink-0"></div>
                        <span className="font-light">Derivatives & Risk Management</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-white/70">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 shrink-0"></div>
                        <span className="font-light">Performance Measurement</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center text-gray-600 dark:text-white/70">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 shrink-0"></div>
                        <span className="font-light">Portfolio Construction</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-white/70">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 shrink-0"></div>
                        <span className="font-light">Ethical & Professional Standards</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Model Selection Section */}
              <motion.section 
                className="relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="mb-16">
                  <motion.div 
                    className="flex items-center mb-8"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <span className="text-6xl font-light text-gray-300 dark:text-white/20 mr-6">02</span>
                    <h2 className="text-2xl lg:text-3xl font-light text-gray-900 dark:text-white tracking-wide">
                      MODEL SELECTION
                      <br />
                      <span className="font-normal text-gray-600 dark:text-white/70">AND CATEGORIZATION</span>
                    </h2>
                  </motion.div>
                  <motion.p 
                    className="text-lg text-gray-600 dark:text-white/60 max-w-4xl leading-relaxed font-light"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    Our benchmark includes <span className="text-gray-900 dark:text-white font-normal">20+ state-of-the-art LLMs</span>, selected to represent a diverse range of capabilities, 
                    architectural designs, and provider ecosystems.
                  </motion.p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-8">
                    <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-gray-200/50 dark:border-white/10">
                      <div className="flex items-center mb-6">
                        <h3 className="text-xl font-light text-gray-900 dark:text-white">Reasoning Models</h3>
                      </div>
                      <p className="text-gray-600 dark:text-white/60 mb-6 font-light">
                        Advanced models with enhanced reasoning capabilities and chain-of-thought processing
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-600 dark:text-white/70"><div className="w-2 h-2 bg-blue-500 rounded-full mr-4 shrink-0"></div><span className="font-light">o3-mini, o4-mini</span></div>
                        <div className="flex items-center text-gray-600 dark:text-white/70"><div className="w-2 h-2 bg-blue-500 rounded-full mr-4 shrink-0"></div><span className="font-light">Claude-3.7-Sonnet, Claude-Opus-4</span></div>
                        <div className="flex items-center text-gray-600 dark:text-white/70"><div className="w-2 h-2 bg-blue-500 rounded-full mr-4 shrink-0"></div><span className="font-light">Claude-Sonnet-4</span></div>
                        <div className="flex items-center text-gray-600 dark:text-white/70"><div className="w-2 h-2 bg-blue-500 rounded-full mr-4 shrink-0"></div><span className="font-light">Gemini-2.5-Pro, Gemini-2.5-Flash</span></div>
                        <div className="flex items-center text-gray-600 dark:text-white/70"><div className="w-2 h-2 bg-blue-500 rounded-full mr-4 shrink-0"></div><span className="font-light">Grok-3-mini-beta (high/low effort)</span></div>
                        <div className="flex items-center text-gray-600 dark:text-white/70"><div className="w-2 h-2 bg-blue-500 rounded-full mr-4 shrink-0"></div><span className="font-light">Deepseek-R1</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-gray-200/50 dark:border-white/10">
                      <div className="flex items-center mb-6">
                        <h3 className="text-xl font-light text-gray-900 dark:text-white">Non-Reasoning Models</h3>
                      </div>
                      <p className="text-gray-600 dark:text-white/60 mb-6 font-light">
                        Standard large language models with direct response generation
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-600 dark:text-white/70"><div className="w-2 h-2 bg-blue-500 rounded-full mr-4 shrink-0"></div><span className="font-light">GPT-4o, GPT-4.1 series</span></div>
                        <div className="flex items-center text-gray-600 dark:text-white/70"><div className="w-2 h-2 bg-blue-500 rounded-full mr-4 shrink-0"></div><span className="font-light">GPT-4.1-mini, GPT-4.1-nano</span></div>
                        <div className="flex items-center text-gray-600 dark:text-white/70"><div className="w-2 h-2 bg-blue-500 rounded-full mr-4 shrink-0"></div><span className="font-light">Claude-3.5-Sonnet, Claude-3.5-Haiku</span></div>
                        <div className="flex items-center text-gray-600 dark:text-white/70"><div className="w-2 h-2 bg-blue-500 rounded-full mr-4 shrink-0"></div><span className="font-light">Grok-3</span></div>
                        <div className="flex items-center text-gray-600 dark:text-white/70"><div className="w-2 h-2 bg-blue-500 rounded-full mr-4 shrink-0"></div><span className="font-light">Llama-3.1-8B-instant, Llama-3.3-70B</span></div>
                        <div className="flex items-center text-gray-600 dark:text-white/70"><div className="w-2 h-2 bg-blue-500 rounded-full mr-4 shrink-0"></div><span className="font-light">Llama-4-Maverick, Llama-4-Scout</span></div>
                        <div className="flex items-center text-gray-600 dark:text-white/70"><div className="w-2 h-2 bg-blue-500 rounded-full mr-4 shrink-0"></div><span className="font-light">Mistral-Large</span></div>
                        <div className="flex items-center text-gray-600 dark:text-white/70"><div className="w-2 h-2 bg-blue-500 rounded-full mr-4 shrink-0"></div><span className="font-light">Palmyra-Fin (finance-specialized)</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Prompting Strategy Section */}
              <motion.section 
                className="relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="mb-16">
                  <motion.div 
                    className="flex items-center mb-8"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <span className="text-6xl font-light text-gray-300 dark:text-white/20 mr-6">03</span>
                    <h2 className="text-2xl lg:text-3xl font-light text-gray-900 dark:text-white tracking-wide">
                      PROMPTING STRATEGY
                      <br />
                      <span className="font-normal text-gray-600 dark:text-white/70">DESIGN</span>
                    </h2>
                  </motion.div>
                  <motion.p 
                    className="text-lg text-gray-600 dark:text-white/60 max-w-4xl leading-relaxed font-light"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    We evaluated <span className="text-gray-900 dark:text-white font-normal">three carefully designed prompting approaches</span> to assess their impact on financial 
                    problem-solving performance across both MCQs and essays.
                  </motion.p>
                </div>

                <div className="space-y-8">
                  <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-gray-200/50 dark:border-white/10">
                    <div className="flex items-center mb-6">
                      <h3 className="text-2xl font-light text-gray-900 dark:text-white">Zero-Shot</h3>
                    </div>
                    <p className="text-gray-600 dark:text-white/60 leading-relaxed font-light">
                      Standard prompts requesting direct answers without explicit reasoning structures. This establishes 
                      baseline performance and tests intrinsic model capabilities for solving problems and generating 
                      financial analyses directly.
                    </p>
                  </div>

                  <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-gray-200/50 dark:border-white/10">
                    <div className="flex items-center mb-6">
                      <h3 className="text-2xl font-light text-gray-900 dark:text-white">Chain-of-Thought with Self-Consistency</h3>
                    </div>
                    <p className="text-gray-600 dark:text-white/60 mb-6 leading-relaxed font-light">
                      Prompts explicitly instruct models to output a step-by-step reasoning process before providing 
                      the final answer. Self-consistency was employed by generating N=3 and N=5 distinct reasoning paths:
                    </p>
                    <div className="space-y-4 pl-6">
                      <div className="flex items-start text-gray-600 dark:text-white/70 font-light">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-4 mt-2 shrink-0"></div>
                        <span>For MCQs: Final answer determined by majority vote</span>
                      </div>
                      <div className="flex items-start text-gray-600 dark:text-white/70 font-light">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-4 mt-2 shrink-0"></div>
                        <span>For Essays: Each response self-graded by GPT-4.1 on custom rubric, highest score selected</span>
                      </div>
                      <div className="flex items-start text-gray-600 dark:text-white/70 font-light">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-4 mt-2 shrink-0"></div>
                        <span>Mimics authentic exam-taking strategies with multiple reasoning paths</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-gray-200/50 dark:border-white/10">
                    <div className="flex items-center mb-6">
                      <h3 className="text-2xl font-light text-gray-900 dark:text-white">Self-Discover</h3>
                    </div>
                    <p className="text-gray-600 dark:text-white/60 leading-relaxed font-light">
                      An adaptive prompting technique where models first devise their own reasoning structure for the problem. 
                      Models select relevant reasoning modules, adapt them to the specific problem, and outline a structured 
                      approach before constructing the final answer. This tests the model's ability to engage in explicit 
                      metacognitive planning for complex financial problem-solving.
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Evaluation Framework Section */}
              <motion.section 
                className="relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="mb-16">
                  <motion.div 
                    className="flex items-center mb-8"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <span className="text-6xl font-light text-gray-300 dark:text-white/20 mr-6">04</span>
                    <h2 className="text-2xl lg:text-3xl font-light text-gray-900 dark:text-white tracking-wide">
                      EVALUATION FRAMEWORK
                      <br />
                      <span className="font-normal text-gray-600 dark:text-white/70">AND METHODOLOGY</span>
                    </h2>
                  </motion.div>
                  <motion.p 
                    className="text-lg text-gray-600 dark:text-white/60 max-w-4xl leading-relaxed font-light"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    Our evaluation framework employs both traditional accuracy metrics and advanced <span className="text-gray-900 dark:text-white font-normal">LLM-as-Judge</span> 
                    techniques to comprehensively assess model performance across multiple dimensions of financial reasoning.
                  </motion.p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-16">
                  <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-gray-200/50 dark:border-white/10">
                    <div className="flex items-center mb-6">
                      <h3 className="text-2xl font-light text-gray-900 dark:text-white">Multiple-Choice Evaluation</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start text-gray-600 dark:text-white/70">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-4 mt-2 shrink-0"></div>
                        <span className="font-light"><strong>Accuracy:</strong> Percentage of correct answers out of 60 total questions</span>
                      </div>
                      <div className="flex items-start text-gray-600 dark:text-white/70">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-4 mt-2 shrink-0"></div>
                        <span className="font-light"><strong>Response Time:</strong> Average time per question in seconds</span>
                      </div>
                      <div className="flex items-start text-gray-600 dark:text-white/70">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-4 mt-2 shrink-0"></div>
                        <span className="font-light"><strong>Cost Analysis:</strong> Total cost in USD for completing all questions</span>
                      </div>
                      <div className="flex items-start text-gray-600 dark:text-white/70">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-4 mt-2 shrink-0"></div>
                        <span className="font-light"><strong>Direct Scoring:</strong> Binary correct/incorrect evaluation</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-gray-200/50 dark:border-white/10">
                    <div className="flex items-center mb-6">
                      <h3 className="text-2xl font-light text-gray-900 dark:text-white">Essay Evaluation</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start text-gray-600 dark:text-white/70">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-4 mt-2 shrink-0"></div>
                        <span className="font-light"><strong>Self Grade:</strong> GPT-4.1 evaluation using CFA Level III rubric (0-4 scale)</span>
                      </div>
                      <div className="flex items-start text-gray-600 dark:text-white/70">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-4 mt-2 shrink-0"></div>
                        <span className="font-light"><strong>Cosine Similarity:</strong> Semantic similarity to reference answers</span>
                      </div>
                      <div className="flex items-start text-gray-600 dark:text-white/70">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-4 mt-2 shrink-0"></div>
                        <span className="font-light"><strong>ROUGE-L F1:</strong> Longest common subsequence-based text overlap</span>
                      </div>
                      <div className="flex items-start text-gray-600 dark:text-white/70">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-4 mt-2 shrink-0"></div>
                        <span className="font-light"><strong>Cost Efficiency:</strong> Cosine similarity per dollar spent</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* LLM-as-Judge Framework Section */}
              <motion.section 
                className="relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="mb-16">
                  <motion.div 
                    className="flex items-center mb-8"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <span className="text-6xl font-light text-gray-300 dark:text-white/20 mr-6">05</span>
                    <h2 className="text-2xl lg:text-3xl font-light text-gray-900 dark:text-white tracking-wide">
                      LLM-AS-JUDGE
                      <br />
                      <span className="font-normal text-gray-600 dark:text-white/70">FRAMEWORK</span>
                    </h2>
                  </motion.div>
                  <motion.p 
                    className="text-lg text-gray-600 dark:text-white/60 max-w-4xl leading-relaxed font-light"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    For essay evaluations, we implement an advanced <span className="text-gray-900 dark:text-white font-normal">LLM-as-Judge framework</span> using GPT-4.1 
                    to provide nuanced assessment beyond traditional accuracy metrics, addressing the complexity of open-ended financial reasoning tasks.
                  </motion.p>
                </div>

                <div className="space-y-8">
                  <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-gray-200/50 dark:border-white/10">
                    <div className="flex items-center mb-6">
                      <h3 className="text-2xl font-light text-gray-900 dark:text-white">Evaluation Workflow</h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl font-light text-blue-600 dark:text-blue-400">1</span>
                        </div>
                        <h4 className="text-lg font-light text-gray-900 dark:text-white mb-3">Question Input</h4>
                        <p className="text-gray-600 dark:text-white/70 font-light text-sm">
                          Essay question with context and requirements presented to the model
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl font-light text-blue-600 dark:text-blue-400">2</span>
                        </div>
                        <h4 className="text-lg font-light text-gray-900 dark:text-white mb-3">Model Response</h4>
                        <p className="text-gray-600 dark:text-white/70 font-light text-sm">
                          Target model generates comprehensive answer using specified prompting strategy
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl font-light text-blue-600 dark:text-blue-400">3</span>
                        </div>
                        <h4 className="text-lg font-light text-gray-900 dark:text-white mb-3">Judge Evaluation</h4>
                        <p className="text-gray-600 dark:text-white/70 font-light text-sm">
                          GPT-4.1 evaluates response using CFA rubric and provides detailed scoring
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-gray-200/50 dark:border-white/10">
                    <div className="flex items-center mb-6">
                      <h3 className="text-2xl font-light text-gray-900 dark:text-white">CFA Level III Rubric Integration</h3>
                    </div>
                    <div className="space-y-6">
                      <p className="text-gray-600 dark:text-white/70 leading-relaxed font-light">
                        Our LLM-as-Judge framework incorporates the official CFA Level III grading rubric, evaluating responses across multiple dimensions:
                      </p>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-start text-gray-600 dark:text-white/70">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-4 mt-2 shrink-0"></div>
                            <span className="font-light"><strong>Technical Accuracy:</strong> Correctness of financial concepts and calculations</span>
                          </div>
                          <div className="flex items-start text-gray-600 dark:text-white/70">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-4 mt-2 shrink-0"></div>
                            <span className="font-light"><strong>Completeness:</strong> Addressing all parts of the question comprehensively</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start text-gray-600 dark:text-white/70">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-4 mt-2 shrink-0"></div>
                            <span className="font-light"><strong>Reasoning Quality:</strong> Logical flow and justification of conclusions</span>
                          </div>
                          <div className="flex items-start text-gray-600 dark:text-white/70">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-4 mt-2 shrink-0"></div>
                            <span className="font-light"><strong>Professional Standards:</strong> Adherence to CFA ethical guidelines</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Metrics and Scoring Section */}
              <motion.section 
                className="relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="mb-16">
                  <motion.div 
                    className="flex items-center mb-8"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <span className="text-6xl font-light text-gray-300 dark:text-white/20 mr-6">06</span>
                    <h2 className="text-2xl lg:text-3xl font-light text-gray-900 dark:text-white tracking-wide">
                      METRICS AND
                      <br />
                      <span className="font-normal text-gray-600 dark:text-white/70">PERFORMANCE ANALYSIS</span>
                    </h2>
                  </motion.div>
                  <motion.p 
                    className="text-lg text-gray-600 dark:text-white/60 max-w-4xl leading-relaxed font-light"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    Our comprehensive metric suite captures both <span className="text-gray-900 dark:text-white font-normal">performance quality</span> and 
                    <span className="text-gray-900 dark:text-white font-normal"> operational efficiency</span>, providing a holistic view of model capabilities 
                    for financial reasoning tasks.
                  </motion.p>
                </div>

                <div className="space-y-8">
                  <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-gray-200/50 dark:border-white/10">
                    <div className="flex items-center mb-6">
                      <h3 className="text-2xl font-light text-gray-900 dark:text-white">Quality Metrics</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h4 className="text-lg font-light text-gray-900 dark:text-white">Multiple-Choice Questions</h4>
                        <div className="space-y-3">
                          <div className="flex items-start text-gray-600 dark:text-white/70">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-4 mt-2 shrink-0"></div>
                            <span className="font-light"><strong>Accuracy (%):</strong> Primary performance indicator measuring correct responses</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-lg font-light text-gray-900 dark:text-white">Essay Questions</h4>
                        <div className="space-y-3">
                          <div className="flex items-start text-gray-600 dark:text-white/70">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-4 mt-2 shrink-0"></div>
                            <span className="font-light"><strong>Self Grade:</strong> GPT-4.1 assessment using CFA rubric</span>
                          </div>
                          <div className="flex items-start text-gray-600 dark:text-white/70">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-4 mt-2 shrink-0"></div>
                            <span className="font-light"><strong>Cosine Similarity:</strong> Semantic alignment with reference answers</span>
                          </div>
                          <div className="flex items-start text-gray-600 dark:text-white/70">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-4 mt-2 shrink-0"></div>
                            <span className="font-light"><strong>ROUGE-L F1:</strong> Text overlap and structural similarity measurement</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-gray-200/50 dark:border-white/10">
                    <div className="flex items-center mb-6">
                      <h3 className="text-2xl font-light text-gray-900 dark:text-white">Efficiency Metrics</h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <h4 className="text-lg font-light text-gray-900 dark:text-white">Cost Analysis</h4>
                        <div className="flex items-start text-gray-600 dark:text-white/70">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-4 mt-2 shrink-0"></div>
                          <span className="font-light">Total evaluation cost in USD across all questions</span>
                        </div>
                        <div className="flex items-start text-gray-600 dark:text-white/70">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-4 mt-2 shrink-0"></div>
                          <span className="font-light">Cost efficiency ratios for essays (cosine/dollar)</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-lg font-light text-gray-900 dark:text-white">Performance Speed</h4>
                        <div className="flex items-start text-gray-600 dark:text-white/70">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-4 mt-2 shrink-0"></div>
                          <span className="font-light">Average response time per MCQ (seconds)</span>
                        </div>
                        <div className="flex items-start text-gray-600 dark:text-white/70">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-4 mt-2 shrink-0"></div>
                          <span className="font-light">Processing efficiency across different strategies</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-lg font-light text-gray-900 dark:text-white">Model Characteristics</h4>
                        <div className="flex items-start text-gray-600 dark:text-white/70">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-4 mt-2 shrink-0"></div>
                          <span className="font-light">Context length capabilities and utilization</span>
                        </div>
                        <div className="flex items-start text-gray-600 dark:text-white/70">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-4 mt-2 shrink-0"></div>
                          <span className="font-light">Reasoning vs. non-reasoning model categorization</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
