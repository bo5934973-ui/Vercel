"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform
} from "framer-motion";
import { ArrowUpRight, BriefcaseBusiness, ChevronLeft, Code2, Mail, MapPin, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const sections = [
  { id: "hero", label: "首页" },
  { id: "about", label: "关于" },
  { id: "skills", label: "能力" },
  { id: "experience", label: "经历" },
  { id: "projects", label: "项目" },
  { id: "contact", label: "联系" }
];

const profile = {
  name: "林辰",
  role: "产品设计工程师",
  tagline: "把复杂系统打磨成安静、清晰、可感知的产品体验。",
  bio:
    "我专注于设计系统、前端架构和交互动效，把产品策略、界面表达与工程实现连成一个可靠闭环。过去 7 年，我为 AI 工具、数据平台和高端消费品牌构建过从 0 到 1 的数字体验。",
  location: "上海 / 远程协作",
  email: "hello@linchen.dev"
};

const skills = [
  { name: "React 系统设计", level: "专家", detail: "组件模型、状态边界、可维护前端架构", proof: "为 B2B 平台重构 120+ 个界面组件" },
  { name: "动效设计", level: "高级", detail: "滚动叙事、微交互、页面过渡", proof: "将关键任务完成率提升 18%" },
  { name: "设计系统", level: "专家", detail: "Token、组件规范、多主题策略", proof: "统一 4 条产品线的视觉与交互语言" },
  { name: "Next.js 工程", level: "高级", detail: "路由、性能、部署策略与页面组织", proof: "核心页面加载稳定在 1.8 秒内" },
  { name: "产品思维", level: "高级", detail: "从用户问题到信息架构和交付路径", proof: "主导 3 个从 0 到 1 的工具产品" },
  { name: "AI 产品体验", level: "高级", detail: "提示流、生成态、校验态与信任机制", proof: "设计企业级智能工作台" }
];

const experience = [
  {
    time: "2024 至今",
    company: "北辰智能",
    title: "产品设计工程负责人",
    desc: "负责 AI 工作台、设计系统和核心交互框架，把模型能力转译为可解释、可协作的产品流程。"
  },
  {
    time: "2021 至 2024",
    company: "Metric Studio",
    title: "资深前端设计师",
    desc: "为数据产品和增长工具建立高密度界面体系，主导从原型、视觉、动效到生产代码的完整交付。"
  },
  {
    time: "2018 至 2021",
    company: "Forma Labs",
    title: "交互设计师",
    desc: "参与消费级硬件官网、品牌电商和移动端体验，形成产品页叙事与性能优化方法。"
  }
];

const projects = [
  {
    title: "极光控制台",
    type: "AI 运营系统",
    year: "2026",
    summary: "面向企业团队的 AI 任务编排控制台，以可追踪状态流降低模型黑箱感。",
    result: "任务回溯时间减少 42%",
    palette: "from-white/24 via-sky-200/12 to-transparent",
    details: [
      "设计分层任务画布、模型响应对比和审批轨道。",
      "用轻量状态过渡让 AI 生成过程更容易被理解。",
      "重构信息架构，使专家用户可以在 2 次点击内到达核心操作。"
    ]
  },
  {
    title: "极简电商系统",
    type: "高端零售",
    year: "2025",
    summary: "为高端生活方式品牌搭建极简电商体验，突出材质、节奏和购买信任。",
    result: "移动端转化提升 23%",
    palette: "from-white/20 via-neutral-300/10 to-transparent",
    details: [
      "建立产品叙事模板，把传统商品页改为滚动式发布页。",
      "设计低噪声购物车和结算流程，减少视觉干扰。",
      "通过图片加载策略和动效降级稳定移动端体验。"
    ]
  },
  {
    title: "Pulse 设计系统",
    type: "设计系统",
    year: "2024",
    summary: "跨网页、桌面和移动端的设计系统，覆盖 token、组件、文档与验证工具。",
    result: "交付周期缩短 31%",
    palette: "from-white/22 via-emerald-200/10 to-transparent",
    details: [
      "定义颜色、字号、间距、圆角和动效 token。",
      "把高频业务组件抽象为可组合模块，并提供交互状态规范。",
      "搭建设计和工程共同维护的组件验收清单。"
    ]
  }
];

const fadeIn = {
  hidden: { opacity: 0, y: 34, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1 }
};

export function AppleResumeSite() {
  const [active, setActive] = useState("hero");
  const [selectedProject, setSelectedProject] = useState(null);
  const reducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 70, damping: 28, mass: 0.4 });
  const smoothY = useSpring(mouseY, { stiffness: 70, damping: 28, mass: 0.4 });
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { threshold: [0.32, 0.48, 0.66], rootMargin: "-10% 0px -28% 0px" }
    );

    sections.forEach(({ id }) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const onMove = (event) => {
      mouseX.set((event.clientX / window.innerWidth - 0.5) * 36);
      mouseY.set((event.clientY / window.innerHeight - 0.5) * 36);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mouseX, mouseY, reducedMotion]);

  useEffect(() => {
    document.body.style.overflow = selectedProject ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  const scrollToSection = (id) => {
    const node = document.getElementById(id);
    if (!node) return;
    node.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <motion.div className="fixed left-0 top-0 z-[80] h-[2px] bg-white/80" style={{ width: progressWidth }} />
      <Navigation active={active} onNavigate={scrollToSection} />
      <AmbientBackground x={smoothX} y={smoothY} />

      <main className="relative z-10">
        <HeroSection active={active} mouseX={smoothX} mouseY={smoothY} />
        <AboutSection active={active} />
        <SkillsSection active={active} />
        <ExperienceSection active={active} />
        <ProjectsSection active={active} onSelect={setSelectedProject} />
        <ContactSection active={active} />
      </main>

      <AnimatePresence>
        {selectedProject ? (
          <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function Navigation({ active, onNavigate }) {
  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-[#050505]/55 backdrop-blur-2xl"
    >
      <nav className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:px-10">
        <button type="button" onClick={() => onNavigate("hero")} className="group flex items-center gap-3 text-left" aria-label="返回首页">
          <span className="grid size-7 place-items-center rounded-full border border-white/15 bg-white/8 text-[11px] font-semibold text-white">
            LC
          </span>
          <span className="hidden text-sm font-medium text-white/88 sm:block">{profile.name}</span>
        </button>
        <div className="flex max-w-[calc(100vw-110px)] items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/[0.045] p-1 text-[12px] text-white/54 backdrop-blur-xl md:gap-2">
          {sections.slice(1).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`relative whitespace-nowrap rounded-full px-3 py-1.5 transition md:px-4 ${active === item.id ? "text-black" : "hover:text-white"}`}
            >
              {active === item.id ? (
                <motion.span layoutId="active-nav" className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
              ) : null}
              <span className="relative z-10">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </motion.header>
  );
}

function AmbientBackground({ x, y }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        style={{ x, y }}
        className="absolute left-1/2 top-[-18%] h-[58rem] w-[58rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18),rgba(142,178,255,0.08)_34%,transparent_68%)] blur-3xl"
      />
      <motion.div
        style={{ x: useTransform(x, (v) => v * -0.55), y: useTransform(y, (v) => v * -0.55) }}
        className="absolute bottom-[-24%] right-[-10%] h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,rgba(184,255,226,0.11),transparent_66%)] blur-3xl"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,5,5,0.18),rgba(5,5,5,0.88)_72%,#050505)]" />
      <div className="noise-layer absolute inset-0 opacity-[0.055]" />
    </div>
  );
}

function FocusSection({ id, active, className = "", children }) {
  const isActive = active === id;
  return (
    <motion.section
      id={id}
      variants={fadeIn}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.26 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      animate={{ opacity: isActive ? 1 : 0.68, filter: isActive ? "blur(0px)" : "blur(0.4px)" }}
      className={`relative mx-auto max-w-[1440px] px-5 py-24 transition md:px-10 md:py-32 ${className}`}
    >
      {children}
    </motion.section>
  );
}

function HeroSection({ active, mouseX, mouseY }) {
  const titleX = useTransform(mouseX, (v) => v * 0.42);
  const titleY = useTransform(mouseY, (v) => v * 0.34);
  return (
    <section id="hero" className="relative mx-auto flex min-h-[100dvh] max-w-[1440px] items-center px-5 pt-20 md:px-10">
      <motion.div animate={{ opacity: active === "hero" ? 1 : 0.62, filter: active === "hero" ? "blur(0px)" : "blur(0.5px)" }} className="grid w-full gap-10">
        <motion.div style={{ x: titleX, y: titleY }} className="max-w-6xl">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="mb-5 text-sm font-medium text-white/54">
            {profile.role}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 28, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1, delay: 0.08, ease: [0.22, 1, 0.36, 1] }} className="max-w-[11ch] text-[clamp(4.2rem,15vw,14rem)] font-semibold leading-[0.88] tracking-[-0.065em] text-white">
            {profile.name}
          </motion.h1>
        </motion.div>
        <div className="grid gap-8 md:grid-cols-[minmax(0,0.72fr)_minmax(280px,0.28fr)] md:items-end">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.22, ease: [0.22, 1, 0.36, 1] }} className="max-w-3xl text-2xl font-medium leading-tight tracking-[-0.025em] text-white/86 md:text-5xl">
            {profile.tagline}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.34, ease: [0.22, 1, 0.36, 1] }} className="glass-panel rounded-[28px] p-5">
            <p className="text-sm leading-7 text-white/62">{profile.bio}</p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

function SectionTitle({ label, title, children }) {
  return (
    <div className="mb-12 max-w-3xl">
      <p className="mb-4 text-sm font-medium text-white/44">{label}</p>
      <h2 className="text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-white md:text-7xl">{title}</h2>
      {children ? <p className="mt-6 max-w-2xl text-base leading-8 text-white/58 md:text-lg">{children}</p> : null}
    </div>
  );
}

function AboutSection({ active }) {
  return (
    <FocusSection id="about" active={active}>
      <SectionTitle label="关于我" title="像设计产品一样设计职业轨迹。">
        我既写代码，也推敲节奏、层级和情绪。我的工作习惯是先把问题讲清楚，再把界面做安静，最后用工程让体验稳定落地。
      </SectionTitle>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["7+", "年产品界面建设经验"],
          ["18", "次从原型到上线的发布"],
          ["4", "套跨团队设计系统落地"]
        ].map(([value, label]) => (
          <motion.div key={value} whileHover={{ y: -6, scale: 1.015 }} transition={{ type: "spring", stiffness: 260, damping: 24 }} className="glass-panel rounded-[28px] p-7">
            <div className="text-5xl font-semibold tracking-[-0.05em] text-white">{value}</div>
            <p className="mt-5 max-w-[18rem] text-sm leading-6 text-white/54">{label}</p>
          </motion.div>
        ))}
      </div>
    </FocusSection>
  );
}

function SkillsSection({ active }) {
  const [hovered, setHovered] = useState(skills[0]);
  return (
    <FocusSection id="skills" active={active}>
      <SectionTitle label="能力" title="能力不做进度条，做成可触摸的系统。">
        每个能力都对应真实案例和可交付结果，悬停查看它在项目中的使用方式。
      </SectionTitle>
      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <div className="grid gap-4 sm:grid-cols-2">
          {skills.map((skill, index) => (
            <motion.button
              key={skill.name}
              type="button"
              onMouseEnter={() => setHovered(skill)}
              onFocus={() => setHovered(skill)}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.56, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -5, scale: 1.018 }}
              className="group relative min-h-[150px] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] p-6 text-left"
            >
              <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_0%,rgba(255,255,255,0.18),transparent_45%)]" />
              <Sparkles className="relative mb-8 size-5 text-white/42 transition group-hover:text-white/80" strokeWidth={1.7} />
              <div className="relative flex items-end justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold tracking-[-0.03em] text-white">{skill.name}</h3>
                  <p className="mt-2 text-sm text-white/48">{skill.level}</p>
                </div>
                <span className="rounded-full border border-white/12 px-3 py-1 text-xs text-white/52">案例</span>
              </div>
            </motion.button>
          ))}
        </div>
        <motion.aside layout className="glass-panel sticky top-24 h-fit rounded-[28px] p-7">
          <p className="mb-10 text-sm text-white/44">能力说明</p>
          <AnimatePresence mode="wait">
            <motion.div key={hovered.name} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
              <h3 className="text-3xl font-semibold tracking-[-0.04em]">{hovered.name}</h3>
              <p className="mt-5 leading-7 text-white/62">{hovered.detail}</p>
              <div className="mt-8 rounded-[22px] border border-white/10 bg-black/26 p-5">
                <p className="text-sm text-white/44">应用案例</p>
                <p className="mt-3 text-lg font-medium leading-7 text-white/86">{hovered.proof}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.aside>
      </div>
    </FocusSection>
  );
}

function ExperienceSection({ active }) {
  return (
    <FocusSection id="experience" active={active}>
      <SectionTitle label="经历" title="从界面细节到产品系统。">
        时间轴会在滚动中逐个点亮，展示我在不同阶段承担的产品、设计和工程职责。
      </SectionTitle>
      <div className="relative mx-auto max-w-4xl">
        <div className="absolute left-[15px] top-3 h-[calc(100%-2rem)] w-px bg-white/10 md:left-1/2" />
        {experience.map((item, index) => (
          <motion.article key={item.company} initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.45 }} transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }} className={`relative mb-12 grid gap-6 pl-12 md:grid-cols-2 md:pl-0 ${index % 2 === 0 ? "" : "md:[&>div:first-child]:col-start-2"}`}>
            <motion.div initial={{ scale: 0.7, opacity: 0.3 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true, amount: 0.7 }} transition={{ duration: 0.7, delay: 0.16 }} className="absolute left-0 top-2 z-10 size-8 rounded-full border border-white/30 bg-white shadow-[0_0_34px_rgba(255,255,255,0.36)] md:left-1/2 md:-translate-x-1/2" />
            <div className="glass-panel rounded-[28px] p-6 md:p-7">
              <p className="text-sm text-white/44">{item.time}</p>
              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.035em] text-white">{item.title}</h3>
              <p className="mt-2 text-sm font-medium text-white/62">{item.company}</p>
              <p className="mt-6 leading-7 text-white/58">{item.desc}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </FocusSection>
  );
}

function ProjectsSection({ active, onSelect }) {
  return (
    <FocusSection id="projects" active={active}>
      <SectionTitle label="项目" title="像产品卡片一样进入项目。">
        默认保持安静，悬停时增强层次，点击后以全屏详情页展开项目结构、结果和设计决策。
      </SectionTitle>
      <div className="grid gap-5 lg:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} onSelect={onSelect} />
        ))}
      </div>
    </FocusSection>
  );
}

function ProjectCard({ project, index, onSelect }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-80, 80], [4, -4]);
  const rotateY = useTransform(x, [-80, 80], [-4, 4]);
  const onPointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  };

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -10, scale: 1.025 }}
      whileTap={{ scale: 0.985 }}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      onClick={() => onSelect(project)}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="group relative min-h-[520px] overflow-hidden rounded-[30px] border border-white/10 bg-[#101010] p-6 text-left shadow-[0_40px_120px_rgba(0,0,0,0.25)]"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${project.palette} opacity-90 transition duration-500 group-hover:opacity-100`} />
      <div className="absolute inset-x-6 top-6 h-44 rounded-[24px] border border-white/10 bg-white/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" />
      <div className="absolute left-10 right-10 top-14 h-24 rounded-full bg-white/14 blur-3xl transition duration-500 group-hover:bg-white/20" />
      <div className="relative flex h-full min-h-[468px] flex-col justify-between">
        <div className="flex items-center justify-between text-sm text-white/46">
          <span>{project.type}</span>
          <span>{project.year}</span>
        </div>
        <div>
          <h3 className="text-4xl font-semibold leading-none tracking-[-0.055em] text-white">{project.title}</h3>
          <p className="mt-5 text-base leading-7 text-white/60">{project.summary}</p>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black button-shine">
            查看案例 <ArrowUpRight className="size-4" strokeWidth={1.8} />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

function ProjectDetail({ project, onClose }) {
  return (
    <motion.div className="fixed inset-0 z-[90] overflow-y-auto bg-[#050505]" initial={{ x: "100%", opacity: 0.9 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "100%", opacity: 0.9 }} transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}>
      <div className="mx-auto min-h-[100dvh] max-w-[1440px] px-5 py-6 md:px-10">
        <div className="sticky top-0 z-10 flex items-center justify-between bg-[#050505]/75 py-4 backdrop-blur-2xl">
          <button type="button" onClick={onClose} className="button-shine inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-white transition hover:bg-white hover:text-black">
            <ChevronLeft className="size-4" strokeWidth={1.8} /> 返回
          </button>
          <button type="button" onClick={onClose} className="grid size-10 place-items-center rounded-full border border-white/12 bg-white/8 text-white transition hover:bg-white hover:text-black" aria-label="关闭项目详情">
            <X className="size-4" strokeWidth={1.8} />
          </button>
        </div>
        <div className="grid min-h-[calc(100dvh-96px)] gap-10 py-12 lg:grid-cols-[0.56fr_0.44fr] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.72 }}>
            <p className="text-sm text-white/44">{project.type} / {project.year}</p>
            <h2 className="mt-6 text-[clamp(3.4rem,10vw,10rem)] font-semibold leading-[0.9] tracking-[-0.07em] text-white">
              {project.title}
            </h2>
            <p className="mt-8 max-w-2xl text-xl leading-8 text-white/64">{project.summary}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.94, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.72, ease: [0.22, 1, 0.36, 1] }} className="glass-panel rounded-[32px] p-6 md:p-8">
            <div className={`mb-8 h-72 rounded-[28px] bg-gradient-to-br ${project.palette} border border-white/10`} />
            <p className="text-sm text-white/44">结果数据</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">{project.result}</p>
            <div className="mt-8 space-y-4">
              {project.details.map((detail) => (
                <div key={detail} className="rounded-[22px] border border-white/10 bg-black/22 p-5 text-sm leading-7 text-white/64">
                  {detail}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function ContactSection({ active }) {
  const contactItems = useMemo(
    () => [
      { icon: Mail, label: profile.email },
      { icon: MapPin, label: profile.location },
      { icon: BriefcaseBusiness, label: "可承接产品设计工程相关工作" },
      { icon: Code2, label: "Next.js / React / 动效 / 设计系统" }
    ],
    []
  );

  return (
    <FocusSection id="contact" active={active} className="pb-12 md:pb-20">
      <div className="grid gap-10 rounded-[34px] border border-white/10 bg-white/[0.045] p-7 backdrop-blur-2xl md:grid-cols-[0.62fr_0.38fr] md:p-12">
        <div>
          <p className="mb-4 text-sm font-medium text-white/44">联系</p>
          <h2 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-white md:text-7xl">
            让下一款产品体验更安静，也更有力量。
          </h2>
          <a href={`mailto:${profile.email}`} className="button-shine mt-9 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.015] active:scale-[0.98]">
            开始沟通 <ArrowUpRight className="size-4" strokeWidth={1.8} />
          </a>
        </div>
        <div className="grid content-end gap-3">
          {contactItems.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-black/20 p-4 text-sm text-white/64">
              <Icon className="size-4 shrink-0 text-white/46" strokeWidth={1.7} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <footer className="mt-10 flex flex-col justify-between gap-4 text-sm text-white/34 md:flex-row">
        <span>使用 Next.js、React、Tailwind CSS 与 Framer Motion 构建。</span>
        <span>示例简历内容，可按真实经历替换。</span>
      </footer>
    </FocusSection>
  );
}
