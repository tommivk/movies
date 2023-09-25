package custom_errors

import "errors"

var ErrNotFound = errors.New("Not Found")
var ErrInvalidCredentials = errors.New("Invalid Credentials")
