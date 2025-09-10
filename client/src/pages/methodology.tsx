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
                        <div className="flex items-center text-gray-600 dark:text-white/70"><div className="w-2 h-2 bg-blue-500 rounded-full mr-4 shrink-0"></div><span className="font-light">GPT-5, GPT-5-mini, GPT-5-nano</span></div>
                        <div className="flex items-center text-gray-600 dark:text-white/70"><div className="w-2 h-2 bg-blue-500 rounded-full mr-4 shrink-0"></div><span className="font-light">o3-mini, o4-mini</span></div>
                        <div className="flex items-center text-gray-600 dark:text-white/70"><div className="w-2 h-2 bg-blue-500 rounded-full mr-4 shrink-0"></div><span className="font-light">Claude-3.7-Sonnet, Claude-Opus-4</span></div>
                        <div className="flex items-center text-gray-600 dark:text-white/70"><div className="w-2 h-2 bg-blue-500 rounded-full mr-4 shrink-0"></div><span className="font-light">Claude-Opus-4.1, Claude-Sonnet-4</span></div>
                        <div className="flex items-center text-gray-600 dark:text-white/70"><div className="w-2 h-2 bg-blue-500 rounded-full mr-4 shrink-0"></div><span className="font-light">Gemini-2.5-Pro, Gemini-2.5-Flash</span></div>
                        <div className="flex items-center text-gray-600 dark:text-white/70"><div className="w-2 h-2 bg-blue-500 rounded-full mr-4 shrink-0"></div><span className="font-light">Grok-4, Grok-3-mini-beta (high/low effort)</span></div>
                        <div className="flex items-center text-gray-600 dark:text-white/70"><div className="w-2 h-2 bg-blue-500 rounded-full mr-4 shrink-0"></div><span className="font-light">Deepseek-R1</span></div>
                        <div className="flex items-center text-gray-600 dark:text-white/70"><div className="w-2 h-2 bg-blue-500 rounded-full mr-4 shrink-0"></div><span className="font-light">Qwen3-32B</span></div>
                        <div className="flex items-center text-gray-600 dark:text-white/70"><div className="w-2 h-2 bg-blue-500 rounded-full mr-4 shrink-0"></div><span className="font-light">GPT-OSS-20B, GPT-OSS-120B</span></div>
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
                        <div className="flex items-center text-gray-600 dark:text-white/70"><div className="w-2 h-2 bg-blue-500 rounded-full mr-4 shrink-0"></div><span className="font-light">Kimi-K2</span></div>
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
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
