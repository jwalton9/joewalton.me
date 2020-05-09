import { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import cx from 'classnames';

import { blogFileNames, readBlogFile, parseFileName } from '../../utils/content';
import { Page } from '../../components/Page';

import styles from './[...slug].module.scss';

interface Props {
  title: string;
  date: string;
  body: string;
}

type Params = {
  slug: string[];
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const filenames = await blogFileNames();
  const paths = filenames.map((filename) => {
    const { slug } = parseFileName(filename);
    return { params: { slug: slug.split('/') } };
  });
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props, Params> = async ({ params }) => {
  const blogFile = await readBlogFile(`${params?.slug.join('-')}.md`);
  return { props: blogFile };
};

const BlogPage: NextPage<Props> = ({ title, body, date }) => (
  <Page title={`Joe Blogs | ${title}`}>
    <div className={styles.spacing}>
      <div className={cx(['o-container c-card', styles.container])}>
        <h1 className={styles.title}>{title}</h1>
        <p>Posted {date} by Joe Walton</p>
        <div className={styles.richText} dangerouslySetInnerHTML={{ __html: body }} />
      </div>
    </div>
  </Page>
);

export default BlogPage;