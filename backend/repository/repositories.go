package repository

type Repositories interface {
	UserRepository() UserRepository
	ClassRepository() ClassRepository
	ClassAdminRepository() ClassAdminRepository
}

type SqlRepositories struct {
	Repository *Repository
	userRepository UserRepository
	classRepository ClassRepository
	classAdminRepository ClassAdminRepository
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

func (r *SqlRepositories) ClassRepository() ClassRepository {
	if r.classRepository != nil {
		return r.classRepository
	}

	var v ClassRepository = &SqlClassRepository{
		r.Repository,
	}
	return v
}

func (r *SqlRepositories) ClassAdminRepository() ClassAdminRepository {
	if r.classAdminRepository != nil {
		return r.classAdminRepository
	}

	var v ClassAdminRepository = &SqlClassAdminRepository{
		r.Repository,
	}
	return v
}