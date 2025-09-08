import { HeaderNavigation } from "@/components/header-navigation";
import Footer from "@/components/footer";

export default function Methodology() {
  return (
    <div className="min-h-screen overflow-x-hidden overflow-y-visible bg-white dark:bg-black flex flex-col">
      <HeaderNavigation />
      <div className="flex-grow relative overflow-visible">
        {/* Floating glass elements */}
        <div className="absolute top-20 right-20 w-40 h-60 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl transform rotate-12 blur-sm"></div>
        <div className="absolute top-80 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-40 right-40 w-48 h-32 bg-gradient-to-br from-white/8 to-white/3 rounded-2xl transform -rotate-6 blur-sm"></div>
        
        <div className="relative z-10 overflow-visible">
          {/* Hero Section */}
          <div className="w-full px-6 lg:px-8 pt-32 pb-20">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <span className="inline-block px-6 py-3 bg-white/5 backdrop-blur-md text-white/80 text-sm font-medium rounded-full border border-white/10">
                  Research Methodology
                </span>
              </div>
              <h1 className="text-6xl lg:text-8xl font-light text-white mb-8 leading-tight tracking-wide">
                THE METHODOLOGY
                <br />
                <span className="font-normal">BEHIND</span>
                <br />
                <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  CFA ARENA
                </span>
              </h1>
              <p className="text-xl text-white/70 max-w-2xl leading-relaxed font-light">
                Our comprehensive approach to evaluating large language models on CFA Level III exam content, 
                combining rigorous dataset construction with advanced prompting strategies.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full px-6 lg:px-8 pb-20">
            <div className="max-w-7xl mx-auto space-y-32">
              
              {/* Dataset Construction Section */}
              <section className="relative">
                <div className="mb-16">
                  <div className="flex items-center mb-8">
                    <span className="text-6xl font-light text-white/20 mr-6">01</span>
                    <h2 className="text-4xl lg:text-5xl font-light text-white tracking-wide">
                      DATASET CONSTRUCTION
                      <br />
                      <span className="font-normal text-white/70">AND VALIDATION</span>
                    </h2>
                  </div>
                  <p className="text-lg text-white/60 max-w-4xl leading-relaxed font-light">
                    As official CFA Level III questions post-2018 are not publicly available due to intellectual property protections, 
                    we constructed our dataset using mock exam materials from AnalystPrep, a reputable CFA preparation provider with 
                    over 100,000 candidates.
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-16">
                  <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-white font-semibold">MCQ</span>
                      </div>
                      <h3 className="text-2xl font-light text-white">Multiple-Choice Questions</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center text-white/70">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mr-4"></div>
                        <span>60 questions total</span>
                      </div>
                      <div className="flex items-center text-white/70">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mr-4"></div>
                        <span>10 vignettes with 6 questions each</span>
                      </div>
                      <div className="flex items-center text-white/70">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mr-4"></div>
                        <span>Covers all major Level III curriculum areas</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-white font-semibold">ESS</span>
                      </div>
                      <h3 className="text-2xl font-light text-white">Essay Questions</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center text-white/70">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-4"></div>
                        <span>11 unique vignettes</span>
                      </div>
                      <div className="flex items-center text-white/70">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-4"></div>
                        <span>43 total questions (149 total points)</span>
                      </div>
                      <div className="flex items-center text-white/70">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-4"></div>
                        <span>2-5 open-ended questions per vignette</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                  <h4 className="text-2xl font-light text-white mb-8 flex items-center">
                    <div className="w-8 h-8 bg-blue-400 rounded-lg mr-4"></div>
                    Coverage Areas
                  </h4>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center text-white/70">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                        <span className="font-light">Private Wealth Management</span>
                      </div>
                      <div className="flex items-center text-white/70">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                        <span className="font-light">Portfolio Management</span>
                      </div>
                      <div className="flex items-center text-white/70">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                        <span className="font-light">Private Markets</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center text-white/70">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                        <span className="font-light">Asset Management</span>
                      </div>
                      <div className="flex items-center text-white/70">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                        <span className="font-light">Derivatives & Risk Management</span>
                      </div>
                      <div className="flex items-center text-white/70">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                        <span className="font-light">Performance Measurement</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center text-white/70">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                        <span className="font-light">Portfolio Construction</span>
                      </div>
                      <div className="flex items-center text-white/70">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                        <span className="font-light">Ethical & Professional Standards</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Model Selection Section */}
              <section className="relative">
                <div className="mb-16">
                  <div className="flex items-center mb-8">
                    <span className="text-6xl font-light text-white/20 mr-6">02</span>
                    <h2 className="text-4xl lg:text-5xl font-light text-white tracking-wide">
                      MODEL SELECTION
                      <br />
                      <span className="font-normal text-white/70">AND CATEGORIZATION</span>
                    </h2>
                  </div>
                  <p className="text-lg text-white/60 max-w-4xl leading-relaxed font-light">
                    Our benchmark includes <span className="text-white font-normal">23 state-of-the-art LLMs</span>, selected to represent a diverse range of capabilities, 
                    architectural designs, and provider ecosystems.
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-8">
                    <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                          <span className="text-white">⚡</span>
                        </div>
                        <h3 className="text-2xl font-light text-white">Frontier Models</h3>
                      </div>
                      <p className="text-white/60 mb-6 font-light">
                        Highly capable, general-purpose models representing the cutting edge
                      </p>
                      <div className="space-y-3">
                        <div className="text-white/70 font-light">• GPT-4o, GPT-4.1 series</div>
                        <div className="text-white/70 font-light">• Grok 3</div>
                        <div className="text-white/70 font-light">• Claude-3.7-Sonnet, Claude-3.5-Sonnet</div>
                        <div className="text-white/70 font-light">• Claude-3.5-Haiku, Claude-Opus-4</div>
                        <div className="text-white/70 font-light">• Claude-Sonnet-4</div>
                        <div className="text-white/70 font-light">• Gemini-2.5-Pro, Gemini-2.5-Flash</div>
                      </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                          <span className="text-white">🧠</span>
                        </div>
                        <h3 className="text-2xl font-light text-white">Reasoning-Enhanced</h3>
                      </div>
                      <p className="text-white/60 mb-6 font-light">
                        Models designed to improve reasoning capabilities
                      </p>
                      <div className="space-y-3">
                        <div className="text-white/70 font-light">• o3-mini, o4-mini</div>
                        <div className="text-white/70 font-light">• Deepseek-R1</div>
                        <div className="text-white/70 font-light">• Grok-3-mini-beta (high/low reasoning)</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                          <span className="text-white">🔓</span>
                        </div>
                        <h3 className="text-2xl font-light text-white">Open-Source</h3>
                      </div>
                      <p className="text-white/60 mb-6 font-light">
                        Accessible and adaptable alternatives
                      </p>
                      <div className="space-y-3">
                        <div className="text-white/70 font-light">• Llama-3.1-8B instant</div>
                        <div className="text-white/70 font-light">• Llama-3.3-70B</div>
                        <div className="text-white/70 font-light">• Llama-4-Maverick</div>
                        <div className="text-white/70 font-light">• Llama-4-Scout</div>
                        <div className="text-white/70 font-light">• Deepseek-R1</div>
                      </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mr-4">
                          <span className="text-white">🎯</span>
                        </div>
                        <h3 className="text-2xl font-light text-white">Specialized</h3>
                      </div>
                      <p className="text-white/60 mb-6 font-light">
                        Domain-specific fine-tuned models
                      </p>
                      <div className="space-y-3">
                        <div className="text-white/70 font-light">• Palmyra-fin (finance-domain specialized)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Prompting Strategy Section */}
              <section className="relative">
                <div className="mb-16">
                  <div className="flex items-center mb-8">
                    <span className="text-6xl font-light text-white/20 mr-6">03</span>
                    <h2 className="text-4xl lg:text-5xl font-light text-white tracking-wide">
                      PROMPTING STRATEGY
                      <br />
                      <span className="font-normal text-white/70">DESIGN</span>
                    </h2>
                  </div>
                  <p className="text-lg text-white/60 max-w-4xl leading-relaxed font-light">
                    We evaluated <span className="text-white font-normal">three carefully designed prompting approaches</span> to assess their impact on financial 
                    problem-solving performance across both MCQs and essays.
                  </p>
                </div>

                <div className="space-y-8">
                  <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-400 to-slate-600 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-white">⚡</span>
                      </div>
                      <h3 className="text-2xl font-light text-white">Zero-Shot</h3>
                    </div>
                    <p className="text-white/60 leading-relaxed font-light">
                      Standard prompts requesting direct answers without explicit reasoning structures. This establishes 
                      baseline performance and tests intrinsic model capabilities for solving problems and generating 
                      financial analyses directly.
                    </p>
                  </div>

                  <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-white">🔗</span>
                      </div>
                      <h3 className="text-2xl font-light text-white">Chain-of-Thought with Self-Consistency</h3>
                    </div>
                    <p className="text-white/60 mb-6 leading-relaxed font-light">
                      Prompts explicitly instruct models to output a step-by-step reasoning process before providing 
                      the final answer. Self-consistency was employed by generating N=3 and N=5 distinct reasoning paths:
                    </p>
                    <div className="space-y-4 pl-6">
                      <div className="flex items-start text-white/70 font-light">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-4 mt-2"></div>
                        <span>For MCQs: Final answer determined by majority vote</span>
                      </div>
                      <div className="flex items-start text-white/70 font-light">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-4 mt-2"></div>
                        <span>For Essays: Each response self-graded on 10-point rubric, highest score selected</span>
                      </div>
                      <div className="flex items-start text-white/70 font-light">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-4 mt-2"></div>
                        <span>Mimics authentic exam-taking strategies with multiple reasoning paths</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-white">🔍</span>
                      </div>
                      <h3 className="text-2xl font-light text-white">Self-Discover</h3>
                    </div>
                    <p className="text-white/60 leading-relaxed font-light">
                      An adaptive prompting technique where models first devise their own reasoning structure for the problem. 
                      Models select relevant reasoning modules, adapt them to the specific problem, and outline a structured 
                      approach before constructing the final answer. This tests the model's ability to engage in explicit 
                      metacognitive planning for complex financial problem-solving.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}