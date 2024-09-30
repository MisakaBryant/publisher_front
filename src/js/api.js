import request from './request'

export const list_project = (project_type) => {
  return request({
    url: '/list_project',
    method: 'get',
    params: {
      project_type: project_type
    }
  })
}

export const get_project = (project_type, project_id) => {
  return request({
    url: '/project',
    method: 'get',
    params: {
      project_type: project_type,
      project_id: project_id
    }
  })

}

const replacer = (key, value) => {
  if(value instanceof Map) {
    return Object.fromEntries(value);
  } else {
    return value;
  }
}

export const add_project = (project_type, project) => {
  console.log(project)
  return request({
    url: '/project',
    method: 'post',
    params: {
      project_type: project_type
    },
    data: JSON.stringify(project, replacer)
  })
}

export const update_project = (project_type, project_id, project) => {
  return request({
    url: '/project',
    method: 'put',
    params: {
      project_type: project_type,
      project_id: project_id
    },
    data: JSON.stringify(project, replacer)
  })
}
