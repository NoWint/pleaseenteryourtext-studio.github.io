import { motion } from 'framer-motion';
import { ChapterMark } from '../components/ChapterMark';
import { TwoCol } from '../components/TwoCol';
import styles from './About.module.css';

export function About() {
  return (
    <section id="about" className={`section ${styles.about}`}>
      <div className="container">
        <ChapterMark num="02" title="About" />
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          我们是谁 <span className={styles.titleEn}>/ Who We Are</span>
        </motion.h2>
        <TwoCol
          items={[
            {
              label: '中文',
              text: '我们是一个由中学生开发者组成的年轻技术工作室。我们起源于深圳的 AIx脑科学研学活动。TiantianYZJ、NoWint、SUKY、chenmuyun_bit 四人在 5 天的研学中组队实验、一起完成汇报、彻夜讨论 AI 与技术。活动结束那天，大家不想就此失联——于是把一个研学小组，变成了一个长期技术工作室。我们不是公司，也不是商业创业团队，更像一个年轻开发者技术社团：因兴趣聚集，因项目合作，因技术成长。成员年龄大约 13–15 岁，自由、开放、兴趣驱动。',
            },
            {
              label: 'EN',
              text: 'We are a teenage developer studio born from an AI research camp in Shenzhen. Four strangers turned teammates in 5 days — and chose to keep going. We are not a company; we are a community of young devs who build real software together. Free, open, and driven by interest. Members are around 13–15 years old.',
            },
          ]}
        />
      </div>
    </section>
  );
}
