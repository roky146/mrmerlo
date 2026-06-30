import Head from 'next/head'
import { detailProjects, getProjectBySlug } from '../../data/projects'
import ProjectPage from '../../components/ProjectPage'

export default function ProjectDetail({ project }) {
  return (
    <>
      <Head><title>{project.title} — mrmerlo.com</title></Head>
      <ProjectPage project={project} />
    </>
  )
}

export async function getStaticPaths() {
  return {
    paths: detailProjects.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const project = getProjectBySlug(params.slug)
  if (!project) return { notFound: true }
  return { props: { project } }
}
