from enum import Enum

class UserRole(str, Enum):
    VET = "vet"
    CLIENT = "client"