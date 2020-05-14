package repository

type Repositories interface {
	UserRepository() UserRepository
}

type SqlRepositories struct {
	Repository *Repository
	userRepository UserRepository
}

func NewSqlRepositories(repository *Repository) *SqlRepositories {
	return &SqlRepositories{
		Repository: repository,
	}
}
func (r *SqlRepositories) UserRepository() UserRepository {
	if r.userRepository != nil {
		return r.userRepository
	}

	var v UserRepository = &SqlUserRepository{
		r.Repository,
	}

	return v
}


