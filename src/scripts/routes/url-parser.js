function extractPathnameSegments(path) {
  const splitUrl = path.split('/');

  return {
    resource: splitUrl[1] || null, 
    id: splitUrl[2] || null, 
  };
}

function constructRouteFromSegments(pathSegments) {
  let pathname = '';

  if (pathSegments.resource) {
    pathname = `/${pathSegments.resource}`; 
  }

  if (pathSegments.id) {
    pathname = `${pathname}/:id`; 
  }

  return pathname || '/'; 
}


export function getActivePathname() {
  return location.hash.replace('#', '') || '/'; 
}

export function getActiveRoute() {
  const pathname = getActivePathname(); 
  const urlSegments = extractPathnameSegments(pathname); 
  return constructRouteFromSegments(urlSegments); 
}

export function parseActivePathname() {
  const hash = window.location.hash; 
  console.log("Current Hash:", hash);  
  const match = hash.match(/#\/story\/(.+)/); 
  if (match) {
    console.log("Story ID found:", match[1]);
    return { id: match[1] };
  } else {
    console.error("ID tidak ditemukan di hash");
    return {};
  }
}


export function getRoute(pathname) {
  const urlSegments = extractPathnameSegments(pathname); 
  return constructRouteFromSegments(urlSegments); 
}

export function parsePathname(pathname) {
  return extractPathnameSegments(pathname); 
}
