function RequestListCtrl($scope) {
  $scope.requests = [
    {"url":"http://nodejs.org/industry-gen/data/microsoft/logo.png","method":"GET","requestHeaders":{"host":"nodejs.org","user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:19.0) Gecko/20100101 Firefox/19.0","accept":"image/png,image/*;q=0.8,*/*;q=0.5","accept-language":"en-US,en;q=0.5","accept-encoding":"gzip, deflate","referer":"http://nodejs.org/","connection":"keep-alive","if-modified-since":"Sat, 31 Mar 2012 01:02:53 GMT","cache-control":"max-age=0"},"responseHeaders":{"server":"nginx","date":"Sun, 10 Mar 2013 21:59:40 GMT","last-modified":"Sat, 31 Mar 2012 01:02:53 GMT","connection":"keep-alive"}},
    {"url":"http://nodejs.org/images/forkme.png","method":"GET","requestHeaders":{"host":"nodejs.org","user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:19.0) Gecko/20100101 Firefox/19.0","accept":"image/png,image/*;q=0.8,*/*;q=0.5","accept-language":"en-US,en;q=0.5","accept-encoding":"gzip, deflate","referer":"http://nodejs.org/","connection":"keep-alive","if-modified-since":"Thu, 07 Mar 2013 00:19:10 GMT","cache-control":"max-age=0"},"responseHeaders":{"server":"nginx","date":"Sun, 10 Mar 2013 21:59:40 GMT","last-modified":"Thu, 07 Mar 2013 00:19:10 GMT","connection":"keep-alive"}},
    {"url":"http://nodejs.org/industry-gen/data/yahoo/logo.png","method":"GET","requestHeaders":{"host":"nodejs.org","user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:19.0) Gecko/20100101 Firefox/19.0","accept":"image/png,image/*;q=0.8,*/*;q=0.5","accept-language":"en-US,en;q=0.5","accept-encoding":"gzip, deflate","referer":"http://nodejs.org/","connection":"keep-alive","if-modified-since":"Sat, 31 Mar 2012 01:02:53 GMT","cache-control":"max-age=0"},"responseHeaders":{"server":"nginx","date":"Sun, 10 Mar 2013 21:59:40 GMT","last-modified":"Sat, 31 Mar 2012 01:02:53 GMT","connection":"keep-alive"}},
    {"url":"http://nodejs.org/images/logo.png","method":"GET","requestHeaders":{"host":"nodejs.org","user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:19.0) Gecko/20100101 Firefox/19.0","accept":"image/png,image/*;q=0.8,*/*;q=0.5","accept-language":"en-US,en;q=0.5","accept-encoding":"gzip, deflate","referer":"http://nodejs.org/","connection":"keep-alive","if-modified-since":"Thu, 07 Mar 2013 00:19:10 GMT","cache-control":"max-age=0"},"responseHeaders":{"server":"nginx","date":"Sun, 10 Mar 2013 21:59:40 GMT","last-modified":"Thu, 07 Mar 2013 00:19:10 GMT","connection":"keep-alive"}}
  ]

  $scope.open = function(item) {
    if($scope.isOpen(item)) {
      $scope.opened = undefined;
    }
    else {
      $scope.opened = item;
    }
  }

  $scope.isOpen = function(item) {
    return $scope.opened === item;
  }

  $scope.anyItemOpen = function(item) {
    return $scope.opened !== undefined;
  }
}
