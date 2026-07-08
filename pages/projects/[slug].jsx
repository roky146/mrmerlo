import { detailProjects, getProjectBySlug, localize } from '../../data/projects'
import ProjectPage from '../../components/ProjectPage'
import Seo from '../../components/Seo'
import JsonLd from '../../components/JsonLd'
import { graph, projectSchema, breadcrumbSchema } from '../../data/site'

export default function ProjectDetail({ project }) {
  // Canónico en español para meta y datos estructurados
  const es = localize(project, 'es')
  const path = `/projects/${project.slug}/`

  return (
    <>
      <Seo title={es.title} description={es.description} path={path} />
      <JsonLd
        data={graph(
          projectSchema(es, path),
          breadcrumbSchema([
            { name: 'Inicio', path: '/' },
            { name: es.title, path },
          ])
        )}
      />
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
