export const getSampleId = () => {
  const { pathname, hash } = window.location

  if (hash) {
    const path_list = hash.split('/')

    return path_list[path_list.indexOf('sample') + 1]
  }

  const path_list = pathname.split('/')

  return path_list[path_list.indexOf('sample') + 1]
}

export const getProjectId = () => {
  const { pathname, hash } = window.location

  if (hash) {
    const path_list = hash.split('/')

    return path_list[path_list.indexOf('project') + 1]
  }

  const path_list = pathname.split('/')

  return path_list[path_list.indexOf('project') + 1]
}
